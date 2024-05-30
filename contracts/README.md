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
      "sample_interval": 1
    }
  ],
  "emergencies": {
    "incendio": [
      {
        "temperatura": {
          "min_threshold": 20,
          "max_threshold": 60,
          "min_variation_rate": 0.01
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


## Integrations between devices