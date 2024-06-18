/* =================================================
  Variables that stores the value read of a specific sensor.
  ================================================== */
volatile float measure_sensor_1 = INFINIT;
volatile float measure_sensor_2 = INFINIT;
volatile float measure_sensor_3 = INFINIT;
volatile float measure_sensor_4 = INFINIT;
volatile float measure_sensor_5 = INFINIT;
volatile bool  flag             = true;

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