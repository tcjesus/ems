/* =================================================
  Variables that stores the value read of a specific sensor.
  ================================================== */
volatile float measure_Luminosity  = INFINIT;
volatile float measure_Temperature = INFINIT;
volatile float measure_humidity    = INFINIT;
volatile float measure_uv          = INFINIT;
volatile bool  flag                = true;

void readSensor_1(){
  if(flag){
      Serial.print("[Sensor] Reading Luminosity: ");
      measure_Luminosity = digitalRead(luminosity);
      Serial.println(measure_Luminosity);
  }
}

void readSensor_2(){
  if(flag){
      Serial.print("[Sensor] Reading UV: ");
      measure_uv = analogRead(uv);
      Serial.println(measure_uv);
  }
}

void readSensor_3(){
  if(flag){
      Serial.print("[Sensor] Reading Humidity: ");
      measure_humidity = 0.0;
      Serial.println(measure_humidity);
  }
}

void readSensor_4(){
  if(flag){
      Serial.print("[Sensor] Reading Temperature: ");
      measure_Temperature =  0.0;
      Serial.println(measure_Temperature);
  }
}

float getSensorValue(String sensor_variable){
    if(strcmp(sensorInDevice[0], sensor_variable.c_str()) == 0){      return measure_Luminosity;  }
    else if(strcmp(sensorInDevice[1], sensor_variable.c_str()) == 0){ return measure_uv;          }
    else if(strcmp(sensorInDevice[2], sensor_variable.c_str()) == 0){ return measure_humidity;    }
    else if(strcmp(sensorInDevice[3], sensor_variable.c_str()) == 0){ return measure_Temperature; }
    return INFINIT;
}