#include <vector>
#include "ArduinoJson.h"
/*================================================================
  Definition of sensors and their respective pins.
 ================================================================= */
#define luminosity D5
#define uv         A0
#define Temp_Humid D7
#define INFINIT 9999

#define NTP_OFFSET   60 * 60      // In seconds
#define NTP_INTERVAL 60 * 1000    // In miliseconds
#define NTP_ADDRESS  "europe.pool.ntp.org"

const char*    sensorModelInDevice[] = {"lm393", "potentiometer", "DHT11", "DHT11"};
const char*    sensorInDevice[]      = {"luminosity", "uv", "humidity", "temperature"};      
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
const char *topic_configInfo       = "testBPC/config/info";
const char *topic_configSr         = "testBPC/config/sensors";
const char *topic_configEmg        = "testBPC/config/emg";
const char *topic_updateConfigInfo = "testBPC/update/config/info";
const char *topic_updateConfigSr   = "testBPC/update/config/sensors";
const char *topic_updateConfigEmg  = "testBPC/update/config/emg";
const char *topic_subscribe        = "testBPC/subscribe";
const char *topic_requisition      = "testBPC/request_data";
const char *topic_sensoring        = "testBPC/sensoring";
const char *topic_required_values  = "testBPC/required_values";

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

// struct Requisition{
//   int  id_request;
//   int id_node;
// };