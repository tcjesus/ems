#include <vector>
#include "ArduinoJson.h"
/*================================================================
  Definition of sensors and their respective pins.
 ================================================================= */
#define PIN_SENSOR_1 D5
#define PIN_SENSOR_2 A0
#define PIN_SENSOR_3 D7
#define PIN_SENSOR_4 D7
#define PIN_SENSOR_5 D6
#define INFINIT 9999

const char*    sensorModelInDevice[] = {"lm393", "potentiometer", "DHT11", "DHT11", "lm353"};
const char*    sensorInDevice[]      = {"luminosity", "uv", "humidity", "temperature", "pression"};      
int            sizeSensorsInDevice   = sizeof(sensorInDevice)/sizeof(sensorInDevice[0]);
int            timeSensoring         = 5;
volatile bool  isSensoring           = false;
volatile bool  flag_sensoring        = true;

typedef struct{
    String payload;
    String topic;
} Package;

/*====================================================================
  Parameters of Wifi Connection
  ==================================================================== */
const char* ssid      = "UEFS_VISITANTES"; // REDE
const char* password  = ""; // SENHA
int timestamp;

/* ===================================================================
  Parameters of MQTT connection
  ==================================================================== */
const char* mqttServer   = "broker.hivemq.com";
int         mqttPort     = 1883;
const char* mqttUser     = "";
const char* mqttPassword = "";

/* ===================================================================
  MQTT Topics
  ==================================================================== */
const char *topic_configInfo              = "uefs/pgcc/device/config/info";
const char *topic_configSr                = "uefs/pgcc/device/config/sensors";
const char *topic_configEmg               = "uefs/pgcc/device/config/emg";
const char *topic_updateConfigInfo        = "uefs/pgcc/device/update/config/info";
const char *topic_updateConfigSr          = "uefs/pgcc/device/update/config/sensors";
const char *topic_updateConfigEmg         = "uefs/pgcc/device/update/config/emg";
const char *topic_subscribe               = "uefs/pgcc/device/subscribe";
const char *topic_requisition             = "uefs/pgcc/device/request_data";
const char *topic_sensoring               = "uefs/pgcc/device/sensoring";
const char *topic_required_values         = "uefs/pgcc/device/required_values";
const char *topic_request_status          = "uefs/pgcc/device/status";
String      topic_request_status_response = "uefs/pgcc/device/status/response/";

/* ===================================================================
  EDU Configurations
  ==================================================================== */
String      device_mac = "";
String      edu_Type;
int         edu_ID;
int         edu_Zone;
float       edu_Latitude;
float       edu_Longitude;

typedef struct{
    String model;
    String variable;
    float  sample_interval;
    float  min_variation_rate;
    bool   isActive;
} Sensor;

typedef struct{
    std::vector<String> sensor_variable;
    std::vector<float>  min_threshold;
    std::vector<float>  max_threshold;
} Sensing;

typedef struct{
    String emg_type;
    std::vector<Sensing> emg_sensing;
} Emergency;

// List of active sensors
std::vector<Sensor>device_sensors;
// List of emergencies
std::vector<Emergency> emergencies;
/* ================================================================== */