#include <Ticker.h>
#include "configuration.h"
#include "ESP8266WiFi.h"
#include <WiFiUdp.h>
#include "MQTTClient.h"
#include "SensorFunctions.h"
/* ================================================
  Functions prototype
  ================================================== */
float aggregateValues(std::vector<float> values);
void availValues(int id_request);
void alertChecksTimeout();
void WifiConnect();
void setTickerMqtt();
DynamicJsonDocument formatMqttMessage(Package);

#define STATE_IDLE 0b0000
#define STATE_CHECK_CONNECTION 0b0001
#define STATE_SEND_SUBSCRIBE 0b0010
#define STATE_WAIT_CONFIG 0b0011
#define STATE_SENSORING 0b0100
#define STATE_PROCESS_PACKAGES 0b0101
#define STATE_READ_SENSOR_REQUESTED 0b0110
#define STATE_SENSOR_REQUEST 0b0111
#define STATE_AVAIL_VALUES 0b1000

/* ================================================
  Control variables of state machine that manage the actions flow of the device.
  =============================================== */
int current_state = STATE_IDLE;
int next_state = STATE_IDLE;

/* =================================================
  Inputs of the state machine
  ================================================= */
bool is_config;
bool have_configInfo;     // Reports whether general configuration information was received.
bool have_configSensors;  // Reports whether information from active sensors was received.
bool have_configEmg;      // Reports whether at least one emergency was received for monitoring.

/* =================================================
  Handler of the periodic function
  ================================================= */
Ticker mqttTickerHandler;
Ticker sensoringHandler;
Ticker sensor1;
Ticker sensor2;
Ticker sensor3;
Ticker sensor4;

MQTTClient mqttClient(mqttServer, mqttPort, mqttUser, mqttPassword);
DynamicJsonDocument pkg_received(1024);

/* =================================================
  MPC Variables
  ================================================= */
int ID_REQUEST = 1;
int required_values_counter = 0;

void WifiConnect() {
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

void setTickerMqtt() {
  mqttTickerHandler.attach(1.0, []() {
    Serial.println((String) "[MQTT] Executing Loop (" + next_state + ")");
    mqttClient.loop();
  });
}

void configInfo(DynamicJsonDocument jsonPkg) {
  edu_Type = jsonPkg["type"].as<String>();
  edu_ID = jsonPkg["id"];
  edu_Zone = jsonPkg["zone"];
  edu_Latitude = jsonPkg["latitude"];
  edu_Longitude = jsonPkg["longitude"];
}

void configSensors(DynamicJsonDocument jsonPkg) {
  JsonArray sr = jsonPkg["s"].as<JsonArray>();
  for (JsonObject s : sr) {
    Sensor sensor;
    sensor.model = s["md"].as<String>();
    ;
    sensor.variable = s["v"].as<String>();
    ;
    sensor.sample_interval = s["si"];
    sensor.min_variation_rate = s["r"];
    sensor.isActive = true;

    if ((strcmp(sensorModelInDevice[0], sensor.model.c_str()) == 0) && (strcmp(sensorInDevice[0], sensor.variable.c_str()) == 0)) {
      sensor1.attach(sensor.sample_interval, readSensor_1);
    } else if ((strcmp(sensorModelInDevice[1], sensor.model.c_str()) == 0) && (strcmp(sensorInDevice[1], sensor.variable.c_str()) == 0)) {
      sensor2.attach(sensor.sample_interval, readSensor_2);
    } else if ((strcmp(sensorModelInDevice[2], sensor.model.c_str()) == 0) && (strcmp(sensorInDevice[2], sensor.variable.c_str()) == 0)) {
      sensor3.attach(sensor.sample_interval, readSensor_3);
    } else if ((strcmp(sensorModelInDevice[3], sensor.model.c_str()) == 0) && (strcmp(sensorInDevice[3], sensor.variable.c_str()) == 0)) {
      sensor4.attach(sensor.sample_interval, readSensor_4);
    }

    device_sensors.push_back(sensor);
  }
}

void configEmg(DynamicJsonDocument pkg) {
  Emergency emg;
  Sensing emg_sensing;
  for (JsonPair keyValue : pkg["emg"].as<JsonObject>()) {
    emg.emg_type = keyValue.key().c_str();
    JsonArray sensors = keyValue.value().as<JsonArray>();
    for (JsonObject sensor : sensors) {
      for (JsonPair sensorKeyValue : sensor) {
        String sensorType = sensorKeyValue.key().c_str();
        JsonObject thresholds = sensorKeyValue.value().as<JsonObject>();
        float thresholdMinimo = thresholds["min"].isNull() ? INFINIT : thresholds["min"];
        float thresholdMaximo = thresholds["max"].isNull() ? INFINIT : thresholds["max"];

        emg_sensing.sensor_variable.push_back(sensorType);
        emg_sensing.min_threshold.push_back(thresholdMinimo);
        emg_sensing.max_threshold.push_back(thresholdMaximo);
      }
    }
    emg.emg_sensing.push_back(emg_sensing);
  }
  emergencies.push_back(emg);
}

void configDevice(DynamicJsonDocument pkg) {
  Device device;

  device.edu_ID = pkg["id"];
  device.edu_Zone = pkg["zone"];
  JsonArray sensorsJson = pkg["s"].as<JsonArray>();
  for (JsonObject s : sensorsJson) {
    Sensor sensor;
    sensor.model = s["md"].as<String>();
    sensor.variable = s["v"].as<String>();
    device.device_sensors.push_back(sensor);
  }

  for (int x = 0; x < devices.size(); x++) {
    if (devices[x].edu_ID == device.edu_ID) {
      devices.erase(devices.begin() + x);
    }
  }

  devices.push_back(device);
  Serial.println((String) "\t\tTotal de dispositivos configurados: " + devices.size());
}

float aggregateValues(std::vector<float> values) {
  float mean = 0;
  for (float value : values) {
    mean += value;
  }
  mean =  mean / values.size();

  return mean;
}

void availValues(int id_request) {
  AlertCheckData alert = alertChecks.at(id_request);
  Serial.println((String) "\t\t[INFO] Checagem de Alerta, id_request: " + id_request + ", devices_count: " + alert.values.size() + "/"+ alert.devices_count +  ", variable: " + alert.variable + ", requested_at: " + alert.timestamp + ", timestamp: " + millis());

  if(alert.values.size() <= 0) {
    Serial.println("\t\t[INFO] Checagem de Alerta falhou. Nenhum valor recebido.");
    alertChecks.erase(alertChecks.find(id_request));
    return;
  }

  float result = aggregateValues(alert.values);

  Serial.println((String) "\t\t[INFO] Valor calculado: " + result);

  // TODO - Comparar com o treshold e notificar o APC caso se confirme a emergência.

  alertChecks.erase(alertChecks.find(id_request));
}

void alertChecksTimeout() {
  for (std::pair<const int, AlertCheckData> pair : alertChecks) {
    AlertCheckData alert = pair.second;
    timestamp = millis();
    if (timestamp >= (alert.timestamp + device_response_timeout)) {
      availValues(alert.id_request);
    }
  }
}

void log_config() {
  Serial.print("\t [CONFIG] Type: ");
  Serial.println(edu_Type);
  Serial.print("\t [CONFIG] ID: ");
  Serial.println(edu_ID);
  Serial.print("\t [CONFIG] Zone: ");
  Serial.println(edu_Zone);
  Serial.print("\t [CONFIG] Latitude: ");
  Serial.println(edu_Latitude);
  Serial.print("\t [CONFIG] Longitude: ");
  Serial.println(edu_Longitude);
  Serial.println("\t [CONFIG] Active Sensors");
  for (Sensor sr : device_sensors) {
    Serial.print("\t\t Variable: ");
    Serial.println(sr.variable);
    Serial.print("\t\t Model: ");
    Serial.println(sr.model);
    Serial.print("\t\t Sample Interval: ");
    Serial.println(sr.sample_interval);
    Serial.print("\t\t Min variation Rate: ");
    Serial.println(sr.min_variation_rate);
    Serial.print("\t\t Status: ");
    Serial.println(sr.isActive);
    Serial.print("\t\t ========================\n");
  }
  Serial.println("\t [CONFIG] Emergencies");
  for (Emergency emg : emergencies) {
    Serial.print("\t\t Emergency Type: ");
    Serial.println(emg.emg_type);
    for (Sensing s : emg.emg_sensing) {
      Serial.print("\t\t Sensing Variable: ");
      for (String str : s.sensor_variable) {
        Serial.print(str);
        Serial.print("-");
      }
      Serial.println("");
    }
    Serial.print("\t\t ========================\n");
  }
}

DynamicJsonDocument formatMqttMessage(Package pkg) {
  DynamicJsonDocument json_pkg(1024);
  deserializeJson(json_pkg, pkg.payload.c_str());
  json_pkg["topic"] = pkg.topic;
  return json_pkg;
}

void setup() {
  Serial.begin(115200);
  // Wifi Connection
  Serial.println("\n[SETUP FUNCTION] Initialization.");
  is_config = false;

  Serial.print("\t [SETUP] Periodic time(seconds) to sensoring: ");
  Serial.println(isSensoring);
  sensoringHandler.attach(timeSensoring, []() {
    if (flag_sensoring) { isSensoring = true; }
  });

  Serial.println("\t [WIFI] Trying connection");
  WifiConnect();

  if (device_mac == "") {
    Serial.print("\t [INFO] Device Mac: ");
    device_mac = String(WiFi.macAddress());
    Serial.print(device_mac);
    Serial.print("\n");
  }

  // Mqtt Connection
  mqttClient.setupMQTT();
  if (!mqttClient.isConnected()) {
    mqttClient.loop();
  }
  // Start Periodic MQTT Loop
  setTickerMqtt();
  // ================================================
}

void loop() {
  DynamicJsonDocument msg_json(1024);
  char payload[256];
  char payload1[256];
  current_state = next_state;
  if (WiFi.status() != WL_CONNECTED) {
    WifiConnect();
  }
  switch (current_state) {
    case (STATE_IDLE):
      Serial.println("[STATE IDLE] Device is running");
      next_state = STATE_CHECK_CONNECTION;
      break;
    case (STATE_CHECK_CONNECTION):
      Serial.println("[STATE CHECK CONNECTION]");
      if (WiFi.status() != WL_CONNECTED) {
        Serial.println("\t [WIFI] Trying connection");
        WifiConnect();
      }
      if (!is_config) {
        next_state = STATE_SEND_SUBSCRIBE;
      } else {
        next_state = STATE_PROCESS_PACKAGES;
      }
      break;
    case (STATE_SEND_SUBSCRIBE):
      Serial.println("[STATE SEND SUBSCRIBE]");
      msg_json["mac"] = device_mac.c_str();
      serializeJson(msg_json, payload);
      mqttClient.publish(topic_subscribe, payload, false);
      Serial.println("\t [INFO] Config Message sent.");
      next_state = STATE_WAIT_CONFIG;
      Serial.println("[STATE WAIT CONFIG]");
      break;
    case (STATE_WAIT_CONFIG):
      if (mqttClient.have_newPackage()) {
        pkg_received = formatMqttMessage(mqttClient.getPackage());
        if (strcmp(pkg_received["topic"], topic_configInfo) == 0) {
          if (!have_configInfo) {
            if (strcmp((const char*)pkg_received["mac"], device_mac.c_str()) == 0) {
              Serial.println("\t [CONFIG] Processing config package.");
              configInfo(pkg_received);
              have_configInfo = true;
            }
          }
        } else if (strcmp(pkg_received["topic"], topic_configSr) == 0) {
          if (!have_configSensors) {
            if (strcmp((const char*)pkg_received["mac"], device_mac.c_str()) == 0) {
              Serial.println("\t [CONFIG] Processing config package.");
              configSensors(pkg_received);
              have_configSensors = true;
            }
          }
        } else if (strcmp(pkg_received["topic"], topic_configEmg) == 0) {
          if (!have_configEmg) {
            if (strcmp((const char*)pkg_received["mac"], device_mac.c_str()) == 0) {
              Serial.println("\t [CONFIG] Processing config package.");
              configEmg(pkg_received);
              have_configEmg = true;
              Serial.println("\t [INFO] Device is configurated.");
              log_config();
              is_config = true;
              Serial.println("[STATE PROCESS PACKAGES]");
              next_state = STATE_PROCESS_PACKAGES;
              break;
            }
          }
        }
      }
      next_state = STATE_WAIT_CONFIG;
      break;
    case (STATE_PROCESS_PACKAGES):
      if (alertChecks.size() > 0) {
        alertChecksTimeout();
      }

      if (mqttClient.have_newPackage()) {
        pkg_received = formatMqttMessage(mqttClient.getPackage());
        if (strcmp(pkg_received["topic"], topic_configEmg) == 0) {
          if (strcmp((const char*)pkg_received["mac"], device_mac.c_str()) == 0) {
            configEmg(pkg_received);
            log_config();
          }
        }

        else if (strcmp(pkg_received["topic"], topic_requisition) == 0) {
          Serial.println("[INFO] STATE READ SENSOR REQUESTED");
          next_state = STATE_READ_SENSOR_REQUESTED;
        }

        // MPC configure device
        else if (strcmp(pkg_received["topic"], topic_configDevice) == 0) {
          Serial.println("[INFO] DEVICE CONFIG RECEIVED");
          configDevice(pkg_received);
        }

        // MPC package monitoring
        else if (strcmp(pkg_received["topic"], topic_sensoring) == 0) {
          Serial.println("[INFO] STATE SENSOR REQUEST");
          next_state = STATE_SENSOR_REQUEST;
        }

        // MPC package monitoring
        else if (strcmp(pkg_received["topic"], topic_required_values) == 0) {
          Serial.println("[INFO] STATE AVAIL VALUES");
          next_state = STATE_AVAIL_VALUES;
        } else {
          next_state = STATE_PROCESS_PACKAGES;
        }
      } else if (isSensoring) {
        Serial.println("[INFO] SENSORING PROCESS");
        next_state = STATE_SENSORING;
      } else {
        next_state = STATE_PROCESS_PACKAGES;
      }
      break;
    case (STATE_SENSORING):
      {
        flag = false;            // Disables the sensor reading
        flag_sensoring = false;  // Disables the set of sensoring flag
        isSensoring = false;
        float sensorValue;
        bool isAnomalous = false;
        bool alert = false;
        bool checkEmgObjects = false;
        JsonObject emergency_group = msg_json.createNestedObject("emergency");
        for (Emergency emg : emergencies) {
          JsonObject emergency_obj;
          JsonArray array_sensor;
          JsonArray array_value;
          isAnomalous = false;
          checkEmgObjects = false;
          for (Sensing s : emg.emg_sensing) {
            for (unsigned int i = 0; i < s.sensor_variable.size(); i++) {
              String sv = s.sensor_variable[i];
              for (Sensor sr : device_sensors) {
                if (sr.isActive) {
                  if (strcmp(sv.c_str(), sr.variable.c_str()) == 0) {
                    sensorValue = getSensorValue(sr.variable);
                    // Don't exist reading for this sensor.
                    if (sensorValue == INFINIT) { continue; }
                    // Checks thresholds of sensor according to emergency
                    if (s.min_threshold[i] == INFINIT) {
                      // Uses only max threshold
                      if (sensorValue >= s.max_threshold[i]) {
                        alert = true;
                        isAnomalous = true;
                      }
                    } else if (s.max_threshold[i] == INFINIT) {
                      // Uses only min threshold
                      if (sensorValue <= s.min_threshold[i]) {
                        alert = true;
                        isAnomalous = true;
                      }
                    } else {
                      // Uses interval threshold
                      if ((sensorValue <= s.min_threshold[i]) || ((sensorValue >= s.max_threshold[i]))) {
                        alert = true;
                        isAnomalous = true;
                      }
                    }
                  }

                  if (isAnomalous) {
                    if (!checkEmgObjects) {
                      emergency_obj = emergency_group.createNestedObject(emg.emg_type);
                      array_sensor = emergency_obj.createNestedArray("sensor");
                      array_value = emergency_obj.createNestedArray("value");
                      checkEmgObjects = true;
                    }
                    bool exist = false;
                    isAnomalous = false;
                    for (String check_sensor : array_sensor) {
                      if (strcmp(check_sensor.c_str(), sr.variable.c_str()) == 0) {
                        exist = true;
                        break;
                      }
                    }
                    if (!exist) {
                      array_sensor.add(sr.variable);
                      array_value.add(sensorValue);
                      Serial.print("\t [INFO] Anomaly Detected: ");
                      Serial.print(sr.variable);
                      Serial.print(" -> ");
                      Serial.println(sensorValue);
                    }
                  }
                }
              }
            }
          }
        }
        if (alert) {
          msg_json["id"] = edu_ID;
          msg_json["zone"] = edu_Zone;
          msg_json["timestamp"] = 10;
          serializeJson(msg_json, payload);
          Serial.print("\t [INFO] Sending Alert Message: ");
          Serial.println(payload);
          mqttClient.publish(topic_sensoring, payload, false);
        }
        flag = true;            // Enables the sensor reading
        flag_sensoring = true;  // Enables the set of sensoring flag
        next_state = STATE_PROCESS_PACKAGES;
      }
      break;
    case (STATE_READ_SENSOR_REQUESTED):
      flag = false;  // Disables the sensor reading;
      if ((int)pkg_received["zone"] == edu_Zone) {
        msg_json["id_request"] = (int)pkg_received["id_request"];
        msg_json["id_node"] = edu_ID;
        msg_json["sensor"] = pkg_received["sensor"];
        for (Sensor sr : device_sensors) {
          if (sr.isActive) {
            if (strcmp(sr.variable.c_str(), pkg_received["sensor"]) == 0) {
              msg_json["value"] = getSensorValue(sr.variable);
              Serial.print("\t [INFO] Sending sensor data requested: ");
              Serial.println((const char*)pkg_received["sensor"]);
              serializeJson(msg_json, payload);
              mqttClient.publish(topic_required_values, payload, false);
            }
          }
        }
      }
      flag = true;  // Enables the sensor reading;
      next_state = STATE_PROCESS_PACKAGES;
      break;

    case (STATE_SENSOR_REQUEST):  //MPC Sensor request function
      if ((int)pkg_received["zone"] != edu_Zone) {
        next_state = STATE_PROCESS_PACKAGES;
        break;
      }

      for (JsonPair kv : pkg_received["emergency"].as<JsonObject>()) {
        String sensor = kv.value()["sensor"][0];

        int id_request = ID_REQUEST++;
        msg_json["id_request"] = id_request;
        msg_json["zone"] = edu_Zone;
        msg_json["id_node"] = edu_ID;
        msg_json["sensor"] = sensor;  // TODO: Se for tratar mais de uma variável, tem que alterar aqui

        serializeJson(msg_json, payload);
        Serial.println(payload);
        mqttClient.publish(topic_requisition, payload, false);

        int devices_count = 0;
        for (Device device : devices) {
          for (Sensor s : device.device_sensors) {
            if (strcmp(s.variable.c_str(), sensor.c_str()) == 0) {
              devices_count++;
              break;
            }
          }
        }
        AlertCheckData alert;
        alert.id_request = id_request;
        alert.variable = sensor;
        alert.timestamp = millis();
        alert.devices_count = devices_count;
        alertChecks.insert(std::pair<int, AlertCheckData>(id_request, alert));
      }

      next_state = STATE_PROCESS_PACKAGES;
      break;

    case (STATE_AVAIL_VALUES): {  //MPC Avail Values function
      int id_request = (int)pkg_received["id_request"];
      String sensor = pkg_received["sensor"].as<String>();
      float value = (float)pkg_received["value"];

      if (alertChecks.count(id_request) <= 0) {
        Serial.println((String) "\t\tChecagem de alerta ignorada. Nenhum alerta encontrado para o id_request: " + id_request);
        next_state = STATE_PROCESS_PACKAGES;
        break;
      }

      AlertCheckData alert = alertChecks.at(id_request);

      if (strcmp(alert.variable.c_str(), sensor.c_str()) != 0) {
        Serial.println((String) "\t\tChecagem de alerta ignorada. Valor de variavel passado difere do esperado. Monitorada: " + alert.variable + " Recebida: " + sensor);
        next_state = STATE_PROCESS_PACKAGES;
        break;
      }

      alert.values.push_back(value);
      alertChecks.erase(alertChecks.find(id_request));
      alertChecks.insert(std::pair<int, AlertCheckData>(id_request, alert));

      timestamp = millis();
      if (alert.values.size() >= alert.devices_count || timestamp >= (alert.timestamp + device_response_timeout)) {
        availValues(id_request);
      }

      next_state = STATE_PROCESS_PACKAGES;
      break;
    }

    default: next_state = STATE_IDLE; break;
  }
}
