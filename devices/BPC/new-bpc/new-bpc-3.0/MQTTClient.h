#include <PubSubClient.h>
#include "MyQueue.h"

Queue<Package> packages(10);

class MQTTClient {
private:
    const char* mqttServer;
    int         mqttPort;
    const char* mqttUser;
    const char* mqttPassword;
    WiFiClient espClient;
    PubSubClient client;

    void connectMQTT() {
        while (!client.connected()) {
            Serial.println("\t [MQTT] Attempting MQTT connection...");
            if (client.connect(device_mac.c_str(), mqttUser, mqttPassword)) {
                Serial.println("\t [MQTT] Connected!!");
            } else {
                Serial.print(" \t [MQTT] Failed connection, rc = ");
                Serial.println(client.state());
                Serial.println("\t [MQTT] Try again in 5 seconds");
                delay(5000);
            }
        }
        // Subscribes on topics
        Serial.println("\t [MQTT] Subscribing on topics....");
        subscribe(topic_configInfo);
        subscribe(topic_configSr);
        subscribe(topic_configEmg);
        subscribe(topic_requisition);
    }

    static void messageReceived(char *topic, byte *payload, unsigned int length){
        Serial.print("\t [MQTT] Message received on topic: ");
        Serial.println(topic);
        //Serial.println((char*)payload);
        // New Package received
        Package pkg;
        pkg.payload = String((char*) payload);
        pkg.topic   = String(topic);
        packages.push(pkg);
    }

public:
    MQTTClient(const char* mqttServer, int mqttPort, const char* mqttUser, const char* mqttPassword) 
        : mqttServer(mqttServer), mqttPort(mqttPort), mqttUser(mqttUser), mqttPassword(mqttPassword), client(espClient) {}

    void setupMQTT() {
        client.setServer(mqttServer, mqttPort);
        client.setCallback(messageReceived);
        if(client.setBufferSize(400)){
            Serial.println("\t [MQTT] Buffer changed");
        }
    }

    void loop() {
        if (!client.connected()) {
            connectMQTT();
        }
        client.loop();
    }

    bool isConnected(){
        return client.connected();
    }

    bool have_newPackage(){
        return ( packages.isEmpty() == true ) ? false : true;
    }

    Package getPackage(){
        return packages.pop();
    }
    void publish(const char* topic, const char* payload, bool retain) {
        client.publish(topic, payload, retain);
    }

    void subscribe(const char* topic) {
        client.subscribe(topic);
    }
};