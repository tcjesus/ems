/*================================================================
  Definition of sensors and their respective pins.
 ================================================================= */
#define luminosity D5
#define infraRed   D6
#define Temp_Humid D7
#define vibration  A0

#define NTP_OFFSET   60 * 60      // In seconds
#define NTP_INTERVAL 60 * 1000    // In miliseconds
#define NTP_ADDRESS  "europe.pool.ntp.org"

/*====================================================================
  Parameters of Wifi Connection
  ==================================================================== */
const char* ssid      = "LSNET_BARRETO"; // REDE
const char* password  = "Tuty7090"; // SENHA
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
const char *topic_config          = "config";
const char *topic_subscribe       = "subscribe";
const char *topic_requisition     = "request_data";
const char *topic_sensoring       = "sensoring";
const char *topic_required_values = "required_values";
const char *topic_get_req_qtde    = "get_number_req";
const char *topic_send_req_qtde   = "send_number_req";

typedef struct{
	byte *payload;
	char *topic;
} Package;

struct Sensor{
  const char*  name;
  float value;
};
struct Emergency{
  const char*  name;
  std::vector<Sensor> sensors;
};
struct Requisition{
  int  id_request;
  int id_node;
};

String device_mac = "";

// List with the name of sensors                                                       
const char * sensor_lst[] = {"luminosity", "infra-red", "vibration", "humidity", "temperature"};
// Mount of sensors     
int size_sensor_lst = 5;