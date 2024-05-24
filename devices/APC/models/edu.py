import paho.mqtt.client as mqtt
from abc import ABC, abstractmethod
import random
import string

class EDU(ABC):
    __broker_address = "broker.hivemq.com"
    __mac_id = ""
    mqtt_topics = {}

    def __init__(self, mac_id):
        self.name     = "UDE"
        self.__mac_id = mac_id
        self.__node_name = self.generate_node_name() # "APC" if self._class_name == 'APC'  else 'MPC'
        self.initialize_topics()
        self.client = self.connect_mqtt()

    def initialize_topics(self):
        self.mqtt_topics['topic_update_ude']        = "update_ude"
        self.mqtt_topics['topic_config']            = "config"
        self.mqtt_topics['topic_subscribe']         = "subscribe"
        self.mqtt_topics['topic_sensoring']         = "sensoring"
        self.mqtt_topics['topic_required_values']   = "required_values"
        self.mqtt_topics['topic_update_node_table'] = "update_node_table"
        self.mqtt_topics['topic_hazard_data']       = "hazard_data"

    def connect_mqtt(self):
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.connect(self.broker_address) #connect to broker
        client.on_message    = self.on_message
        client.on_connect    = self.on_connect
        client.on_disconnect = self.on_disconnect 
        return client

    def generate_node_name(self):
        length = 6
        # choose from all lowercase letter
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        print("[INFO] Random string of length", length, "is:", result_str)
        return result_str

    def get_mac_id(self):
        return self.__mac_id

    @staticmethod
    @abstractmethod
    def on_message(self, client, userdata, message):
        return

    @staticmethod
    @abstractmethod
    def on_connect(self, client, userdata, flags, reason_code, properties):
        return

    @staticmethod
    @abstractmethod
    def on_disconnect(self, reasoncode, properties):
        return
    @property
    def broker_address(self):
        return self.__broker_address
    
    @property
    def node_name(self):
        return self.__node_name
        
    @classmethod
    def set_nodename(cls, value):
        cls.__node_name = value
        
        

