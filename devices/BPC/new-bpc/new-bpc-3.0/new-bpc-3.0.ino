#include "configuration.h"
#include "ESP8266WiFi.h"
#include "ArduinoJson.h"
#include <WiFiUdp.h>
#include <user_interface.h>
#include "MQTTClient.h"

/* ================================================
  Functions prototype
  ================================================== */
void WifiConnect();

#define STATE_IDLE                    0b0000
#define STATE_CHECK_CONNECTION        0b0001
#define STATE_SEND_SUBSCRIBE          0b0010
#define STATE_WAIT_CONFIG             0b0011
#define STATE_WAIT_PACKAGE            0b0100
#define STATE_SENSORING               0b0101
#define STATE_PROCESS_PACKAGES        0b0110
#define STATE_STORE_MEASURES          0b0111
#define STATE_READ_SENSORS_REQUESTED  0b1000
#define STATE_CONFIG_DEVICE           0b1001

/* ================================================
  Control variables of state machine that manage the actions flow of the device.
  =============================================== */
int current_state = STATE_IDLE;
int next_state    = STATE_IDLE;

/* =================================================
  Inputs of the state machine
  ================================================= */
bool is_config;               // Variable informs whether the device is configurated.
bool is_sent_message_config;  // Variable that informs whether the message requesting configuration has already been sent.

MQTTClient mqttClient(mqttServer, mqttPort, mqttUser, mqttPassword);
DynamicJsonDocument pkg_received(2024);

void WifiConnect(){
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("");
    Serial.print("\t [Wifi] Connected to ");
    Serial.println(ssid);
    Serial.print("\t\t IP address: ");
    Serial.println(WiFi.localIP());
}

DynamicJsonDocument createDynamicJson(Package pkg){
    DynamicJsonDocument json_pkg(2024);
    deserializeJson(json_pkg, (char*) pkg.payload);
    json_pkg["topic"] = pkg.topic;
    return json_pkg;
}


void setup() {
  Serial.begin(115200);
  // Wifi Connection ==============================
  Serial.println("[SETUP FUNCION] Initialization.");
  is_config = false;
  mqttClient.setupMQTT();
  // ================================================
}

void loop() {
  current_state = next_state;

  switch(current_state){
    case(STATE_IDLE):
        Serial.println("[STATE IDLE] Device is running");
        next_state = STATE_CHECK_CONNECTION;
        break;
    case(STATE_CHECK_CONNECTION):
        Serial.println("[STATE CHECK CONNECTION].....");
        while(WiFi.status() != WL_CONNECTED){
            Serial.println("\t [WIFI] Trying connection");
            WifiConnect();
        }
        if(device_mac == ""){
            Serial.print("\t Device Mac: ");
            device_mac = String(WiFi.macAddress());
            Serial.print(device_mac);
        }
        if(!is_config){
            next_state = STATE_SEND_SUBSCRIBE;
        }else{
            next_state = STATE_PROCESS_PACKAGES;
        }
        break;
    case(STATE_SEND_SUBSCRIBE):
        Serial.println("[STATE SEND SUBSCRIBE].....");
        next_state = STATE_WAIT_CONFIG;
        break;
    case(STATE_WAIT_CONFIG):
        mqttClient.loop();
        Serial.println("[STATE WAIT CONFIG]");
        if(mqttClient.have_newPackage()){
            pkg_received =  createDynamicJson ( mqttClient.getPackage() );
            if(strcmp(pkg_received["topic"], topic_config) == 0){
                next_state = STATE_CONFIG_DEVICE;
            }else{
                next_state = STATE_WAIT_CONFIG;
                delay(1000);
            }
        }else{
            next_state = STATE_WAIT_CONFIG;
            delay(1000);
        }
        break;
    case(STATE_SENSORING): break;
    case(STATE_STORE_MEASURES): break;
    case(STATE_READ_SENSORS_REQUESTED): break;
    case(STATE_CONFIG_DEVICE): 
        Serial.println("[STATE CONFIG DEVICE]");
        // Calls the config function
        Serial.println("\t [INFO] Device is configurated.");
        is_config  = true;
        next_state = STATE_PROCESS_PACKAGES;
        break;
    case(STATE_PROCESS_PACKAGES):
        Serial.println("[STATE PROCESS PACKAGES]");
        mqttClient.loop();
        delay(2000);
        next_state = STATE_PROCESS_PACKAGES;
        break;
    default: next_state = STATE_IDLE;
  }

}
