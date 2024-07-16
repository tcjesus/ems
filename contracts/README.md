## Integrations between backend and devices
### Update Device Configuration
#### Request:
**Topic:** `uefs/pgcc/ems/update_device_config`
```json
{
  "id": 1,
  "type": "APC",
  "mac": "00:00:00:00:00:00",
  "latitude": -12.198102,
  "longitude": -38.9727037,
  "zone": 1,
  "active_sensors": [
    {
      "model": "CM18-2008A",
      "variable": "temperature",
      "sample_interval": 1,
      "min_variation_rate": 0.01
    }
  ],
  "emergencies": {
    "incendio": [
      {
        "temperatura": {
          "min": 20,
          "max": 60
        }
      }
    ]
  }
}
```
### Request Monitoring Data
#### Request:
**Topics:**
* `uefs/pgcc/ems/request_realtime_data`
* `uefs/pgcc/ems/request_realtime_data/zone/:zone_id`
* `uefs/pgcc/ems/request_realtime_data/device/:device_id`

```json
{
  "variables": ["temperature", "humidity"] // It can be empty, which means all variables
}
```
#### Response:
**Topic:** `uefs/pgcc/ems/response_realtime_data`
```json
{
  "device_id": 1,
  "measures": [
    {
      "variable": "temperature",
      "sensor": "CM18-2008A",
      "value": 25.0,
      "start_time": "2024-01-01T00:00:00Z",
      "end_time": "2024-01-01T00:00:00Z"
    },
    {
      "variable": "temperature",
      "sensor": "CM18-2008A",
      "value": 26.0,
      "start_time": "2024-02-01T00:00:00Z",
      "end_time": "2024-02-01T00:00:00Z"
    }
  ]
}
```
## Communication between devices in the Sensor Network
### Configuration process between HPC and Nodes
#### Node Request:
**Topic:** `uefs/pgcc/device/subscribe`
```json
{ "mac": "00:00:00:00:00:00" }
```
#### APC Response:
**Topic (to BPC and MPC):** `uefs/pgcc/device/config/info`
```json
{"mac": "00:00:00:00:00:00", "type": "XXX", "id": 0, "zone": 0,"latitude": 00.000,"longitude": 00.000}
```
**Topic (to BPC and MPC):** `uefs/pgcc/device/config/sensors`
```json
{
   "mac":"00:00:00:00:00:00",
   "s":[{"v":"xxxxxx", "md":"xxxxx", "si":0, "r":0.5}]
}
```
**Topic (to BPC and MPC):** `uefs/pgcc/device/config/emg`
```json
{
   "mac":"00:00:00:00:00:00",
   "emg":{
      "fire": [{ "humidity":{ "min":-9999, "max": 9999 }, "temperature":{ "min":-9999, "max": 9999 } } ]
    }
}

{
   "mac":"00:00:00:00:00:00",
   "emg":{
      "flood":[{ "humidity":{ "min":-9999, "max": 9999 }, "vibration":{ "min":-9999, "max": 9999 } } ]
   }
}
```
**Topic (only MPC):** `uefs/pgcc/device/config/emgList`
```json
{ 
    "mac": "00:00:00:00:00:00",
    "emg_list": { "fire": [{ "humidity":{ "min":-9999, "max": 9999 }, "temperature":{ "min":-9999, "max": 9999 } } ] }
}

{ 
    "mac": "00:00:00:00:00:00",
    "emg_list": { "flood":[{ "humidity":{ "min":-9999, "max": 9999 }, "vibration":{ "min":-9999, "max": 9999 } } ] }
}
```
**Topic (only MPC):** `uefs/pgcc/device/update_node_table`
```json
{
    "id":      0,
    "id_node": 0,
    "zone":    0,
    "s": [
        {"v": "temperature", "md": "modelo_xxx"},
        {"v": "humidity"   , "md": "modelo_xxx"},
        {"v": "pression"   , "md": "modelo_xxx"},
        {"v": "gas"        , "md": "modelo_xxx"},
        {"v": "uv"         , "md": "modelo_xxx"}
    ]
}
```
### Sensoring and alert Process
#### Node Package
**Topic:** `uefs/pgcc/device/status`
```json
{
    "type": "MPC",
    "id":   0,
    "zone": 0,
    "timestamp": 121546456
}
```
#### MPC Response
**Topic:** `uefs/pgcc/device/status/response/:device_id`
```json
{
    "type": "MPC",
    "dev_id": 0,
    "timestamp": 121546456
}
```
#### Node Package
**Topic:** `uefs/pgcc/device/sensoring`
```json
{
    "mpcId": 0,
    "id":    0,
    "zone":  0,
    "timestamp": 12315465,
    "emergency": {"fire":{"sensor": ["temperature"], "value": [70]}}
}
```
## Data request process by MPCs
#### MPC Request
**Topic:** `uefs/pgcc/device/request_data`
```json
{
    "id_request": 0,
    "id_node":    0,
    "zone":       0,
    "sensor":     "xxxxxx"
}
```
#### Node response
**Topic:** `uefs/pgcc/device/required_values`
```json
{
    "id_request":  0,
    "id_node":     0,
    "id_node_req": 0,
    "sensor":      "xxxxxx",
    "value":       0.0
}
```