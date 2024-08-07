/* =================================================
  Variables that stores the value read of a specific sensor.
  ================================================== */
// Previous values
float last_measure_sensors[5] = {INFINIT, INFINIT, INFINIT, INFINIT, INFINIT};
// Current values
volatile float measure_sensor_1 = INFINIT;
volatile float measure_sensor_2 = INFINIT;
volatile float measure_sensor_3 = INFINIT;
volatile float measure_sensor_4 = INFINIT;
volatile float measure_sensor_5 = INFINIT;
volatile bool  flag             = true;
volatile bool  flag_FS_isFull   = false;

void readSensor_1(){
  if(flag){
      Serial.print("[Sensor] Reading ");
      Serial.print(sensorInDevice[0]);
      Serial.print(": ");
      measure_sensor_1 = digitalRead(PIN_SENSOR_1);
      Serial.println(measure_sensor_1);
  }
}

void readSensor_2(){
  if(flag){
      Serial.print("[Sensor] Reading ");
      Serial.print(sensorInDevice[1]);
      Serial.print(": ");
      measure_sensor_2 = analogRead(PIN_SENSOR_2);
      Serial.println(measure_sensor_2);
  }
}

void readSensor_3(){
  if(flag){
      Serial.print("[Sensor] Reading ");
      Serial.print(sensorInDevice[2]);
      Serial.print(": ");
      measure_sensor_3 = 0.0;
      Serial.println(measure_sensor_3);
  }
}

void readSensor_4(){
  if(flag){
      Serial.print("[Sensor] Reading ");
      Serial.print(sensorInDevice[3]);
      Serial.print(": ");
      measure_sensor_4 =  0.0;
      Serial.println(measure_sensor_4);
  }
}

void readSensor_5(){
    if(flag){
      Serial.print("[Sensor] Reading ");
      Serial.print(sensorInDevice[4]);
      Serial.print(": ");
      measure_sensor_5 = 0.0;
      Serial.println(measure_sensor_5);
    }
}

float getSensorValue(String sensor_variable){
    if(strcmp(sensorInDevice[0], sensor_variable.c_str()) == 0){      return measure_sensor_1; }
    else if(strcmp(sensorInDevice[1], sensor_variable.c_str()) == 0){ return measure_sensor_2; }
    else if(strcmp(sensorInDevice[2], sensor_variable.c_str()) == 0){ return measure_sensor_3; }
    else if(strcmp(sensorInDevice[3], sensor_variable.c_str()) == 0){ return measure_sensor_4; }
    else if(strcmp(sensorInDevice[4], sensor_variable.c_str()) == 0){ return measure_sensor_5; }
    return INFINIT;
}

const char* getSensorFile(String sensor_variable){
    if(strcmp(sensorInDevice[0], sensor_variable.c_str()) == 0){      return measure_fileName_s1; }
    else if(strcmp(sensorInDevice[1], sensor_variable.c_str()) == 0){ return measure_fileName_s2; }
    else if(strcmp(sensorInDevice[2], sensor_variable.c_str()) == 0){ return measure_fileName_s3; }
    else if(strcmp(sensorInDevice[3], sensor_variable.c_str()) == 0){ return measure_fileName_s4; }
    else if(strcmp(sensorInDevice[4], sensor_variable.c_str()) == 0){ return measure_fileName_s5; }
    return "";
}

const char* getSensorTempFile(String sensor_variable){
    if(strcmp(sensorInDevice[0], sensor_variable.c_str()) == 0){      return temp_measure_file_s1; }
    else if(strcmp(sensorInDevice[1], sensor_variable.c_str()) == 0){ return temp_measure_file_s2; }
    else if(strcmp(sensorInDevice[2], sensor_variable.c_str()) == 0){ return temp_measure_file_s3; }
    else if(strcmp(sensorInDevice[3], sensor_variable.c_str()) == 0){ return temp_measure_file_s4; }
    else if(strcmp(sensorInDevice[4], sensor_variable.c_str()) == 0){ return temp_measure_file_s5; }
    return "";
}

const char* getSensorFile_by_index(int sr_index){
    if(sr_index == 0){      return measure_fileName_s1; }
    else if(sr_index == 1){ return measure_fileName_s2; }
    else if(sr_index == 2){ return measure_fileName_s3; }
    else if(sr_index == 3){ return measure_fileName_s4; }
    else if(sr_index == 4){ return measure_fileName_s5; }
    return "";
}

const char* getSensorTempFile_by_index(int sr_index){
    if(sr_index == 0){      return temp_measure_file_s1; }
    else if(sr_index == 1){ return temp_measure_file_s2; }
    else if(sr_index == 2){ return temp_measure_file_s3; }
    else if(sr_index == 3){ return temp_measure_file_s4; }
    else if(sr_index == 4){ return temp_measure_file_s5; }
    return "";
}

