from argparse   import ArgumentParser
from models.edu import EDU
from models.ActiveSensorsTable import ActiveSensorsTable
from jsonFileHandler.JsonFileHandler import JsonFileHandler
from getmac   import get_mac_address as gma
from datetime import datetime
import threading
import numpy as np
import json
import re,uuid
import os.path
import signal
import time

eduFile_path = "./config_files/edus.json"
emgFile_path = "./config_files/emgs.json"

eduFile_handler  = JsonFileHandler(eduFile_path)
emgFile_handler  = JsonFileHandler(emgFile_path)

mutex_config     = threading.Lock()

def get_mac_address():
    # Gets the MAC address
    mac = uuid.getnode()
    print(mac)
    # Formats the MAC address in a corret string.
    mac_address = ':'.join(['{:02x}'.format((mac >> elements) & 0xff) for elements in range(0, 2*6, 2)][::-1])
    return mac_address

def compare_dicts(dict1, dict2):
    # Checks if the number of keys is the same.
    if len(dict1) != len(dict2):
        return False
    # Checks if all keys in dict1 are in dict2 and have the same values.
    for key, value in dict1.items():
        if key not in dict2 or dict2[key] != value:
            return False
    return True

def load_emergencies():
    emgs    = {}
    n_lines = emgFile_handler.get_number_of_lines()
    for n in range(1,n_lines + 1):
        line = emgFile_handler.get_line(n)
        emgs[line["emg"]] = line["monitoring"]
    return emgs

def load_edus():
    edus    = []
    n_lines = eduFile_handler.get_number_of_lines()
    for n in range(1,n_lines + 1):
        line = eduFile_handler.get_line(n)
        edus.append(line)
    return edus

def rename_keys(array_of_dicts):
    # Mapeamento das chaves antigas para as novas chaves
    key_mapping = {
        "variable": "v",
        "model": "md",
        "sample_interval": "si",
        "min_variation_rate": "r"
    }

    # Função auxiliar para renomear as chaves em um único dicionário
    def rename_dict_keys(d):
        return {key_mapping.get(k, k): v for k, v in d.items()}

    # Aplica a renomeação de chaves para cada dicionário no array
    return [rename_dict_keys(d) for d in array_of_dicts]

class APC(EDU):

    _class_name = 'APC'

    def __init__(self, id_mac_temp):
        super(APC,self).__init__(id_mac_temp)
        mutex_config.acquire()
        self.isConfig        = False
        mutex_config.release()
        self.deviceClass     = "APC"
        self.emerg           = {};              # Stores the definition of all emergencies that are monitoring by an edu device.
        self.active_nodes_Table  = ActiveSensorsTable()
        if not eduFile_handler.is_empty() :     # Check whether the APC received any configuration, including itself.
            self.emerg = load_emergencies()
            print("[INFO] Emergency config file read successfully.")
            print("[INFO] Loading table of active nodes....")
            edus = load_edus()
            for e in edus:                      # Stores in edu table, all devices that were configurated previously.
                self.active_nodes_Table.addNewNode([e])
            print("[INFO] Table of active nodes load successfully.")
            mutex_config.acquire()
            self.isConfig = True
            mutex_config.release()
            print("[INFO] APC is configurated.")
        else:
            print("[INFO] Waiting by config package.")

    def on_connect(self, client, userdata, flags, reason_code, properties):
        print("[INFO] APC is connected on broker.")
        print("[INFO] Subscribing on topic: " + self.mqtt_topics['topic_update_ude'])
        self.client.subscribe(self.mqtt_topics['topic_update_ude'])
        print("[INFO] Subscribing on topic: " + self.mqtt_topics['topic_subscribe'])
        self.client.subscribe(self.mqtt_topics['topic_subscribe'])
        print("[INFO] Subscribing on topic: " + self.mqtt_topics['topic_hazard_data'])
        self.client.subscribe(self.mqtt_topics['topic_hazard_data'])

    def on_disconnect(self, reasoncode, properties):
        print("[INFO] APC Client is disconnected.")

    def on_message(self, client, userdata, message):
        str_msg = str(message.payload.decode("utf-8"))
        if message.topic == self.mqtt_topics['topic_update_ude']:   
            msg                             = json.loads(str_msg)
            apcConfigData                   = {}
            try:
                device_mac                      = msg["mac"]
                apcConfigData["mac"]            = msg["mac"]
                apcConfigData["type"]           = msg["type"]
                apcConfigData["id"]             = msg["id"]
                apcConfigData["zone"]           = msg["zone"]
                apcConfigData["latitude"]       = msg["latitude"]
                apcConfigData["longitude"]      = msg["longitude"]
                apcConfigData["active_sensors"] = rename_keys(msg["active_sensors"])
                apcConfigData["emergencies"]    = {}
            except KeyError:
                print("[ERROR] Json package with non-existent key.")
                return
            
            mutex_config.acquire()
            if not self.isConfig:
                if apcConfigData["mac"] != self.get_mac_id():
                    return
            else:
                infoAPC = self.active_nodes_Table.getNodeByMac(self.get_mac_id())
                if apcConfigData["zone"] != infoAPC["zone"]:
                    return
            mutex_config.release()

            print("[INFO] Configuring new device......")
            print("[INFO] Configuration package of new/update EDU received ***")
            for key, value in msg["emergencies"].items():
                apcConfigData["emergencies"][key] = []
                for i in range(len(value)):
                    search = self.emergencyExist(key, value[i])     # 'value[i]' is a dictionary
                    if(search == 0):                                # Type of emergency and monitoring already exist.
                        apcConfigData["emergencies"][key].append( self.search_by_monitoring_index(key, value[i]) )
                    elif(search == 1):                              # Type of emergency don't exist
                        self.emerg[key] = [value[i]]
                        emgFile_handler.write_to_file({"emg": key, "monitoring": [ value[i] ]})
                        apcConfigData["emergencies"][key] = [0]
                    elif(search == 2):                              # Type of emergency exists, but not with these monitoring parameters
                        self.emerg[key].append(value[i])            # Adds a new type of monitoring for a emergency
                        line_number = emgFile_handler.get_line_number("emg", key)
                        emgFile_handler.delete_line(line_number)
                        emgFile_handler.write_to_file({"emg": key, "monitoring": self.emerg[key] })
                        apcConfigData["emergencies"][key].append(len(self.emerg[key]) - 1)
            if(self.active_nodes_Table.isActiveNode(device_mac)):   # Update process
                line_number = eduFile_handler.get_line_number("mac", device_mac)
                eduFile_handler.delete_line(line_number)
                eduFile_handler.write_to_file(apcConfigData)
                self.active_nodes_Table.updateTable(device_mac, [apcConfigData])
                print(f"[INFO] Device {device_mac} updated.")
                if(device_mac != self.get_mac_id()):
                    self.send_config(device_mac, 1)
            else:                                                   # New EDU
                print(f"[INFO] New device {device_mac} added.")
                eduFile_handler.write_to_file(apcConfigData)
                self.active_nodes_Table.addNewNode([apcConfigData])
            if(device_mac == self.get_mac_id()):
                mutex_config.acquire()
                self.isConfig = True
                mutex_config.release()
            else:
                self.send_nodes_to_MPC()
        elif message.topic == self.mqtt_topics['topic_subscribe']:
            print("[INFO] Enrollment message received")
            msg         = json.loads(str_msg)
            device_mac  = msg["mac"]
            if not self.active_nodes_Table.isActiveNode(device_mac):
                print("[WARNING] Device with MAC: " + device_mac + " is not registed.")
            else:
                self.send_config(device_mac, 0)
        elif message.topic == self.mqtt_topics['topic_hazard_data']:
            print(f"***  Sensing message received *** ")
            print(str_msg)
            print("\n")
            msg = json.loads(str_msg)
            #self.fuzzy_processing(msg)

    def emergencyExist(self, emerg_type, mnt_param):
        if(emerg_type in self.emerg):
            for i in range(len(self.emerg[emerg_type])):
                if(compare_dicts(mnt_param, self.emerg[emerg_type][i])):
                    return 0
            return 2
        return 1

    def search_by_monitoring_index(self, emerg_type, mnt_param):
        for i in range(len(self.emerg[emerg_type])):
            if(compare_dicts(mnt_param, self.emerg[emerg_type][i])):
                return i
        return -1

    def log_config(self, device_mac):
        print("[INFO] Device features:")
        infoEDU = self.active_nodes_Table.getNodeByMac(device_mac)
        print("\t Type: "           + infoEDU["type"]                )
        print("\t ID: "             + str(infoEDU["id"])             )
        print("\t Zone: "           + str(infoEDU["zone"])           )
        print("\t Latitude: "       + str(infoEDU["latitude"])       )
        print("\t Longitude: "      + str(infoEDU["longitude"])      )
        print("\t Active Sensors: " + str(infoEDU["active_sensors"]) )
        print("\t Emergencies: " + str(infoEDU["emergencies"]) )

    def send_nodes_to_MPC(self):
        '''
        Methods that publishes the updated active nodes table in the specific topic. This way, MPCs will always have this table 
        updated.
        '''
        msg = {}
        msg["node_table"] = self.active_nodes_Table.getTable().to_dict()
        json_msg = json.dumps(msg)
        print("[INFO] Sending to all MPCs the active nodes table updated.")
        self.client.publish(self.mqtt_topics['topic_update_node_table'], json_msg)

    def send_config(self, device_mac, isUpdate):
        configEDU     = self.active_nodes_Table.getNodeByMac(device_mac)
        aux           = {"emergencies":{}}
        for emg, value in configEDU["emergencies"].items():
            eduEmg_config = []
            for index in value:
                eduEmg_config .append( self.emerg[emg][index] )
            aux["emergencies"][emg] = eduEmg_config.copy()
        configEDU["emergencies"] = aux["emergencies"]
        # Info package
        infoPackage = { "type":      configEDU["type"], 
                        "mac":       configEDU["mac"], 
                        "id":        configEDU["id"],
                        "zone":      configEDU["zone"],
                        "latitude":  configEDU["latitude"],
                        "longitude": configEDU["longitude"],
                        "upd":       isUpdate,
                        "H":         datetime.now().hour,
                        "M":         datetime.now().minute }
        print("[INFO] Sending info config message to device with MAC: " + device_mac)
        self.client.publish(self.mqtt_topics['topic_config/info'], str(infoPackage))
        time.sleep(1)
        # Sensors Package
        print("[INFO] Sending sensors config message to device with MAC: " + device_mac)
        sensorsPackage = { "mac": configEDU["mac"], "s": configEDU["active_sensors"], "upd": isUpdate}
        self.client.publish(self.mqtt_topics['topic_config/sensors'], str(sensorsPackage))
        time.sleep(1)
        # Emergency Packages
        print("[INFO] Sending emergency config message to device with MAC: " + device_mac)
        firstEmg = isUpdate
        for emg, value in configEDU["emergencies"].items():
            emgPackages = {"mac": configEDU["mac"], "emg":{emg: value}, "upd": firstEmg}
            firstEmg    = False
            self.client.publish(self.mqtt_topics['topic_config/emg'], str(emgPackages))
            time.sleep(1)
        # Checks the type 
        if(configEDU["type"] == "MPC"):
            print("[INFO] Sending emergency list to device with MAC: " + device_mac)
            # Include the list of emergencies registered by APC
            for emg, value in self.emerg.items():
                emgList = {"mac": configEDU["mac"], "emg_list":{emg : value}, "upd": isUpdate}
                self.client.publish(self.mqtt_topics['topic_config/emgList'], str(emgList))
                time.sleep(1)
        print("[INFO] Config process finished.")

    def sensoring(self):
        return super().sensoring()
    
    def loop(self):
        self.client.loop_start()

    def handle_exit(self, signum, frame):
        print("\n ==============================================================")
        print("[INFO] CONTENT OF THE TABLE ACTIVE NODES")
        df = self.active_nodes_Table.getTable()
        if(df.empty != True):
            for i in range(len(df)):
                self.log_config(df.loc[i, "mac"])
        else:
            print("\tTable empty")
        print("==============================================================")
        print("==============================================================")
        print("[INFO] EMERGENCIES STORED")
        if(len(self.emerg) != 0):
            for key_emerg in self.emerg:
                print("\t" + key_emerg + ":")
                for m in self.emerg[key_emerg]:
                    print("\t\t" + str(m))
        else:
            print("\t Without emergencies")
        print("==============================================================")
        print("==============================================================")
        print("[INFO] Disconnecting from MQTT broker...")
        self.client.disconnect()
        print("[INFO] Disconnected from MQTT broker.Exiting program.")
        print("[INFO] Exiting program.")
        exit(0)

if __name__  == "__main__":
    # description = "Get arguments"
    # parser = ArgumentParser(description=description)
    # parser.add_argument("-mac", "--mac", default="1")
    # args = parser.parse_args()
    # print(args)
    #mac_id = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff)
    #            for ele in range(0,8*6,8)][::-1])
    # Set up signal handler for "Ctrl + C"
    mac_id = gma()
    apc    = APC(mac_id)
    print("[INFO] Device MAC: " + apc.get_mac_id())
    signal.signal(signal.SIGINT, apc.handle_exit)
    apc.loop()
    while(True): # Waits until the APC receive the configuration package.
        mutex_config.acquire()
        if(apc.isConfig):
            mutex_config.release()
            break
        else:
            mutex_config.release()
    while(True):
        pass