import json
import os
import time
import paho.mqtt.client as mqtt

# Function to read a JSON file
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Callback function when the connection is established
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker successfully!")
    else:
        print(f"Connection failed, error code: {rc}")

# Callback function when a message is published
def on_publish(client, userdata, mid, reason_code, properties):
    print(f"Message published with ID: {mid}")

def sendJsonContent(json_file, mqttTopic):
    # Send the content of JSON file
    if os.path.exists(json_file):
        print(f"Reading file: {json_file}")
        data = read_json_file(json_file)
        payload = json.dumps(data)  # Convert the JSON file content to a string
        result = client.publish(mqttTopic, payload)
        result.wait_for_publish()  # Wait for the publish to complete
        print(f"Content of file sent successfully!")
        time.sleep(1)  # Wait 1 second before sending the next file
    else:
        print(f"The file {json_file} does not exist!")

relative_path = "JsonFilesTests/"
base_dir      = os.path.dirname(__file__)
pathFiles     = os.path.join(base_dir, relative_path)
# MQTT client configuration
broker      = "broker.hivemq.com"   # MQTT broker address
port        = 1883                  # MQTT broker port
configTopic = "update_ude"
subscrTopic = "subscribe"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_publish = on_publish

# Connect to the MQTT broker
client.connect(broker, port, 60)

# List of JSON files to send
json_configFiles  = [ pathFiles + "configAPC.json", pathFiles + "configBPC_1.json", pathFiles + "configBPC_2.json", pathFiles + "configMPC_1.json"]
json_subFiles     = [ pathFiles + "subscrBPC_1.json", pathFiles +  "subscrBPC_2.json", pathFiles + "subscrMPC_1.json"]
#json_subFiles     = [ pathFiles + "subscrBPC_1.json"]
for js in json_configFiles:
    sendJsonContent(js, configTopic)
for js in json_subFiles:
    sendJsonContent(js, subscrTopic)
# Send test node update
sendJsonContent(pathFiles + "config_newBPC_2.json", configTopic)

# Disconnect from the MQTT broker
client.disconnect()