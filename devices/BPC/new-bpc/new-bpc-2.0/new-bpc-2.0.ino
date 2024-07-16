#include "ESP8266WiFi.h"
#include <PubSubClient.h>
#include "ArduinoJson.h"
#include <stddef.h>
#include <user_interface.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
//#include <DateTimeTZ.h>

#define NTP_OFFSET   60 * 60      // In seconds
#define NTP_INTERVAL 60 * 1000    // In miliseconds
#define NTP_ADDRESS  "europe.pool.ntp.org"

/*================================================================
  Definição dos sensores e seus respectivos pinos
 ================================================================= */
#define luminosity D5
#define infraRed   D6
#define Temp_Humid D7
#define vibration  A0

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

DynamicJsonDocument e(1024);                     // Para teste de como armazenar as emergencias
DynamicJsonDocument sensors(1024);               // Dicionário com todos os sensores como chave e o valor como thresholder. Valores não ativados possuem valor 'false'
JsonObject emg;                                  // Armazenando todas as emergências, seus sensores e respectivos threshoulders
os_timer_t tmr0;                                 // timer para controle do sensoriamento
int measure_now = 0;
std::vector<Emergency> emergencies;
std::vector<Requisition> received_requests;      // armazena informações das requisições que já foram respondidas.
WiFiClient espClient;                            // Objeto para manipulacao das funcoes do Wifi
PubSubClient client(espClient);                  // Objeto para manipulacao das acoes entre o cliente e o broker.
int is_config = 0;                               // define se o node ja foi configurado
int region;                                      // Região em que o node está atuando.
int id_node;
String mac_id;                                   // id MAC do node
/////////////////////////////////// Sensores ///////////////////////////////////////
// Para adicionar novos sensores deve adicionar a string nessa lista, adicionar o //
// método get{nome_novo_sensor}, e adicionar a condicional em sensoring. Além de  //
// adicionar a constante com o pino utilizado por ele                             //
                         ///////////////////////////////////
// Lista com o nome dos sensores                                                       
const char * sensor_lst[] = {"luminosity", "infra-red", "vibration", "humidity", "temperature"};      
int size_sensor_lst = sizeof(sensor_lst)/sizeof(sensor_lst[0]); // Quantidade de Sensores
/* ===================================================================
  Configurações do cliente MQTT
  ==================================================================== */
const char *mqtt_broker     = "test.mosquitto.org";   // Host do broker
const char *mqtt_username   = "";                    // Usuario
const char *mqtt_password   = "";                    // Senha
const int mqtt_port         = 1883;                  // Porta
bool      mqttStatus = 0;
const char *topic_config          = "config";
const char *topic_subscribe       = "subscribe";
const char *topic_requisition     = "request_data";
const char *topic_sensoring       = "sensoring";
const char *topic_required_values = "required_values";
const char *topic_get_req_qtde    = "get_number_req";
const char *topic_send_req_qtde   = "send_number_req";
/*====================================================================
  Parâmetros de conexão do NTP
  ==================================================================== */
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, NTP_ADDRESS, NTP_OFFSET, NTP_INTERVAL);

/*====================================================================
  Parâmetros de conexão do Wifi
  ==================================================================== */
const char* ssid      = "LSNET_BARRETO"; // REDE
const char* password  = "Tuty7090"; // SENHA
int timestamp;
/*========================================== 
  Protótipos das funcoes 
  ========================================== */ 
int sensoring();
int avail_request(DynamicJsonDocument d);
int request_function(DynamicJsonDocument d);
int config_function(DynamicJsonDocument d);
void initialize_sensors();
void ISR(void*z);
float get_sensor(String sensor_name);
void log_config();
void subscribe();
void callback(char *topic, byte * payload, unsigned int length);
// ===================================================================

void ISR(void*z){ measure_now = 1;}
bool findRequisition(Requisition r, int id_req) { return r.id_request == id_req;}


void WifiConnect(){
  //  Conexão com Wifi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

bool connectMQTT(){
  byte tentativa = 0;
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  if(client.setBufferSize(400)){
    Serial.println("Buffer alterado");
  }
  do {
    mac_id = String(WiFi.macAddress());
    if (client.connect(mac_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.printf("Exito na conexão: Cliente %s conectado ao broker\n", mac_id.c_str());
    } else {
      Serial.print("Falha ao conectar: ");
      Serial.print(client.state());
      Serial.println();
      Serial.print("Tentativa: ");
      Serial.println(tentativa);
      delay(2000);
    }
    tentativa++;
  } while (!client.connected() && tentativa < 5);

  if (tentativa < 5) {
    // publish and subscribe   
    client.subscribe(topic_requisition);
    client.subscribe(topic_config);
    client.subscribe(topic_send_req_qtde);
    client.subscribe(topic_get_req_qtde); 
    return 1;
  } else {
    Serial.println("Não conectado");    
    return 0;
  }
}

/* ===================================================================
  Funcao de callback para pre-processamento dos pacotes recebidos atraves 
  dos topicos inscritos.
 ==================================================================== */
void callback(char *topic, byte * payload, unsigned int length) {
  int fbk;
  char type_topic[20];
  DynamicJsonDocument rec(2024); // Documento para leitura de dados JSON
  deserializeJson(rec, (char*)payload);
    
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  Serial.println((char*)payload);
  if(strcmp(topic, topic_requisition) == 0){
    if ((int) rec["region"] == region){
      avail_request(rec);
      fbk = request_function(rec);
    }
  }else if(strcmp(topic, topic_config) == 0){
    if(strcmp((const char*) rec["id_mac"], mac_id.c_str()) == 0){
      Serial.println("\n   *** Configuration message identified *** \n");
      is_config = config_function(rec);
    }
  }
  Serial.println("-----------------------\n-----------------------");
}

/* ======================================================
 Funcao para envio de pacote de inscricao do BPC na rede
 ======================================================= */
void subscribe(){
    DynamicJsonDocument msg_json(1024);
    char msg_sensoring[256];

    msg_json["id_mac"] = mac_id.c_str();
    serializeJson(msg_json, msg_sensoring);
    client.publish(topic_subscribe, msg_sensoring); 
}

void initialize_sensors(){
  Serial.println("Begin initialize_sensors");
  int i;
  for(i = 0;i < size_sensor_lst; i++){
    // false é representado por zero, talvez seja necessário mudar isso para o futuro.
    sensors[sensor_lst[i]] = 0;
  }
  Serial.println("End initialize_sensors");
}

/*==========================================================
  Funcao responsavel por realizar o processo de configuracao
  do BPC.
  ========================================================== */
int config_function(DynamicJsonDocument d){
  Serial.println("Begin Config Process");
  int i ; 
  float value;

  region = (int) d["region"];
  id_node = (int) d["id_node"];

  emg = d["emergency"];
  for(JsonPair e: emg){
    Emergency new_emg;
    new_emg.name = e.key().c_str();

    JsonObject sens = e.value().as<JsonObject>();
    for(JsonPair s : sens){
      Sensor new_sensor;
      new_sensor.name = s.key().c_str() ;
      new_sensor.value = s.value().as<float>();
      new_emg.sensors.push_back(new_sensor);
    }
    emergencies.push_back(new_emg);

  }

  JsonArray s = d["sensors"];
  for (JsonVariant sensor : s) {
    String sensorName = sensor.as<String>();
    sensors[sensorName] = 1;
  }
  Serial.println("End Config Process");
  log_config();
  return 1;
}

/* ===============================================================
  Funcao responsavel por gerar os logs do processo de configuracao
  ================================================================ */
void log_config(){
  Serial.println("DATA LOG_CONFIG ");
  Serial.print("   ID MAC: ");
  Serial.println(mac_id);
  Serial.println("");
  Serial.print("   Region: ");
  Serial.println(region);
  Serial.print("   Detection Unit ID: ");
  Serial.println(id_node);
  Serial.println("");

  for(Emergency e : emergencies){
    Serial.print("Emergency: ");
    Serial.println(e.name);
    for(Sensor s : e.sensors){
      Serial.print("Sensor: ");
      Serial.println(s.name);
      Serial.print("Valor Gatilho: ");
      Serial.println(s.value);
    }
  }
  for(int i = 0;i < size_sensor_lst; i++){
    // false é representado por zero, talvez seja necessário mudar isso para o futuro.
    Serial.print(sensor_lst[i]);
    Serial.print(": ");
    Serial.println((int) sensors[sensor_lst[i]]);
  }
}

/*========================================================

  ======================================================== */
int avail_request(DynamicJsonDocument req)
{
    int id_req;
    id_req = (int) req["id_request"];
    std::vector<Requisition>::iterator it = find_if(received_requests.begin(), received_requests.end(), [id_req](Requisition r){return findRequisition(r, id_req);});
    if (it != received_requests.end()) {
        Requisition r;
        r = *it;
    }
    return 1;
}

/* =========================================================================
  Funcao utilizada para enviar dados dos sensores a partir de uma requisicao
  enviada pelo MPC ou APC.
  ========================================================================= */
int request_function(DynamicJsonDocument d){
  const char* sensor;
  float value;
  sensor = d["sensor"];
  
  if((float)sensors[sensor]){
    DynamicJsonDocument msg_json(1024);
    char msg_request[256];

    value = get_sensor(sensor);
    msg_json["sensor"] = sensor;
    msg_json["value"] = value;
    msg_json["id_node"] = id_node;
    msg_json["id_request"] = (int) d["id_request"];
    serializeJson(msg_json, msg_request);
    client.publish(topic_required_values, msg_request);
    Serial.println("Valores requisitados enviados");
  }else{
    Serial.println("Não possui sensor da requisição");
  }
  return 1;
}

/* =========================================================================
  Funcao utilizada para capturar o valor atual de um determinado sensor.
  ========================================================================= */
float get_sensor(String sensor_name){
  float value; 
  if(strcmp(sensor_name.c_str(), sensor_lst[0]) == 0){
    value = 1.0;
  }
  if(strcmp(sensor_name.c_str(), sensor_lst[1]) == 0){
    value = digitalRead(infraRed);
  }
  else if(strcmp(sensor_name.c_str(), sensor_lst[2]) == 0){
    value = analogRead(vibration);
  }else if(strcmp(sensor_name.c_str(), sensor_lst[3]) == 0){
    value = 50;
  }else if(strcmp(sensor_name.c_str(), sensor_lst[4]) == 0){
    value = 21;
  }
  return value;
}


int sensoring(){
  Serial.println("\n   *** Sensoring Process ***\n");
  DynamicJsonDocument msg_json(1024);
  JsonObject emergency_group = msg_json.createNestedObject("emergency");
  std::vector<Sensor> measures;
  // is_anomalous representa um valor identificado localmente na emergencia, zera de emergencia em emergencia
  // alert é geral, assim que é identificado valor anomalo ele muda pra 1
  int i            = 0;
  int is_anomalous = 0; 
  int alert        = 0;
  // Obtenção das medidas de cada um dos sensores ativos
  Serial.print("Enabled Sensor: ");
  for(i = 0; i < size_sensor_lst; i++){
    if((float)sensors[sensor_lst[i]]){
      Sensor new_sensor;
      new_sensor.name = sensor_lst[i];
      new_sensor.value = get_sensor(sensor_lst[i]);
      measures.push_back(new_sensor);
      Serial.print(new_sensor.name);
      Serial.print("(Value = ");
      Serial.print(new_sensor.value);
      Serial.print("),");
    }
  }
  // Percorre as emergencias e vai verificando se as medições obtidas definem valores anômalos para cada uma delas
  for(Emergency e : emergencies){
    JsonObject emergency_obj;
    JsonArray array_sensor;
    JsonArray array_value;
    
    is_anomalous = 0;
    Serial.print("\nEmergency: ");
    Serial.println(e.name);
    for(Sensor s : e.sensors){  // verifica para cada sensor da emergencia, se tem um valor medido.
      Serial.print("Sensor: ");
      Serial.println(s.name);
      for(Sensor s_measure : measures){
        // Verifica a medida para aquele sensor e vê se a medição está acima do valor gatilho
        if(strcmp(s.name, s_measure.name)== 0){
          if(s_measure.value >= s.value){
            if(!is_anomalous){ // se teve comportamento anomalo significa que ja foi definido como nestedobjects antes
              emergency_obj = emergency_group.createNestedObject(e.name);
              array_sensor = emergency_obj.createNestedArray("sensor");
              array_value = emergency_obj.createNestedArray("value");
            }
            array_sensor.add(s_measure.name);
            array_value.add(s_measure.value);
            Serial.println("Anomaly detected: ");
            Serial.print(s_measure.name);
            Serial.print(" -> ");
            Serial.println(s_measure.value);
            is_anomalous = 1;
            alert = 1;
          }
          break; // break para o for que iterá sobre o nome dos sensores medidos. Pois o sensor ja foi encontrado, apenas nao possui valor anomalo
        }
      }
    }
  }
  // Se foi identificado um valor anomalo é montado o resto da mensagem e ela é enviada.
  if(alert){
    char msg_sensoring[256];
    msg_json["region"] = region;
    msg_json["id_node"] = id_node;
    timestamp = timeClient.getEpochTime();
    msg_json["timestamp"] = timestamp;
    serializeJson(msg_json, msg_sensoring);
    Serial.println("   *** Sensoring Message ***\n");
    Serial.print("   Message: ");
    Serial.println(msg_sensoring);
    client.publish(topic_sensoring, msg_sensoring);
  }
  Serial.println("--------------------------------");
  return 0;
}

void setup(void){
  //  Configuração da Serial
  Serial.begin(115200);

  timeClient.begin();

  //  Conexão com Wifi
  WifiConnect();

  // Conexão MQTT
  mqttStatus =  connectMQTT();
  if(mqttStatus){
     Serial.println("MQTT conectado");
  }
  else{
     Serial.println("MQTT não conectado");
  }
  os_timer_setfn(&tmr0, ISR, NULL); //Indica ao Timer qual sera sua Sub rotina.
  os_timer_arm(&tmr0, 5000, true);
  initialize_sensors();
  subscribe(); // Realiza inscricao do BPC na rede
}

void loop() {
  timeClient.update();
  if (mqttStatus){
    client.loop();    
    if(is_config && measure_now){
      sensoring();
      measure_now = 0;
    }       
  }
  else { connectMQTT(); }
}
