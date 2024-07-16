#include <vector>
#include "ArduinoJson.h"
#include "LittleFS.h"
/*================================================================
  Definition of sensors and their respective pins.
 ================================================================= */
#define PIN_SENSOR_1 D5
#define PIN_SENSOR_2 A0
#define PIN_SENSOR_3 D7
#define PIN_SENSOR_4 D7
#define PIN_SENSOR_5 D6
#define INFINIT      9999
#define LESS_INFINIT 9999

const char*    sensorModelInDevice[] = {"lm393", "potentiometer", "DHT11", "DHT11", "lm353"};
const char*    sensorInDevice[]      = {"luminosity", "uv", "humidity", "temperature", "pression"};      
const int      sizeSensorsInDevice   = sizeof(sensorInDevice)/sizeof(sensorInDevice[0]);
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
const char* ssid      = ""; // REDE
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
const char *topic_configInfo                     = "uefs/pgcc/device/config/info";
const char *topic_configSr                       = "uefs/pgcc/device/config/sensors";
const char *topic_configEmg                      = "uefs/pgcc/device/config/emg";
const char *topic_subscribe                      = "uefs/pgcc/device/subscribe";
const char *topic_requisition                    = "uefs/pgcc/device/request_data";
const char *topic_sensoring                      = "uefs/pgcc/device/sensoring";
const char *topic_required_values                = "uefs/pgcc/device/required_values";
const char *topic_request_status                 = "uefs/pgcc/device/status";
String      topic_request_status_response        = "uefs/pgcc/device/status/response/";
const char *topic_request_realtime_data          = "uefs/pgcc/ems/request_realtime_data";     
String      topic_request_realtime_data_zone     = "uefs/pgcc/ems/request_realtime_data/zone/";
String      topic_request_realtime_data_device   = "uefs/pgcc/ems/request_realtime_data/device/"; 
const char *topic_request_realtime_data_response = "uefs/pgcc/ems/response_realtime_data";
/* ===================================================================
  Mesuare File's Name
  ==================================================================== */
const char *measure_fileName_s1 = "/measures/s1.txt";
const char *measure_fileName_s2 = "/measures/s2.txt";
const char *measure_fileName_s3 = "/measures/s3.txt";
const char *measure_fileName_s4 = "/measures/s4.txt";
const char *measure_fileName_s5 = "/measures/s5.txt";

const char *temp_measure_file_s1 = "/measures/temp_s1.txt";
const char *temp_measure_file_s2 = "/measures/temp_s2.txt";
const char *temp_measure_file_s3 = "/measures/temp_s3.txt";
const char *temp_measure_file_s4 = "/measures/temp_s4.txt";
const char *temp_measure_file_s5 = "/measures/temp_s5.txt";

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