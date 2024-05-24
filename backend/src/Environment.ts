export class Environment {
  static validate () {
    if (!process.env.NODE_ENV) throw new Error('NODE_ENV is not defined')
  }

  static get NODE_ENV () {
    return process.env.NODE_ENV || 'development'
  }

  static get IS_DEV_ENV () {
    const devEnvs = ['development', 'local']
    return devEnvs.includes(Environment.NODE_ENV)
  }

  static get PORT () {
    return process.env.PORT || 3001
  }

  static get DB_HOSTNAME () {
    return process.env.DB_HOSTNAME || 'localhost'
  }

  static get DB_PORT (): number {
    return Number(process.env.DB_PORT) || 3306
  }

  static get DB_USERNAME () {
    return process.env.DB_USERNAME || 'root'
  }

  static get DB_PASSWORD () {
    return process.env.DB_PASSWORD || 'password'
  }

  static get DB_DATABASE () {
    return process.env.DB_DATABASE || 'ems_db'
  }

  static get DB_CONNECTION_LIMIT (): number {
    return Number(process.env.DB_CONNECTION_LIMIT) || 10000
  }

  static get DB_CONNECTION_TIMEOUT (): number {
    return Number(process.env.DB_CONNECTION_TIMEOUT) || 30000
  }

  static get JWT_SECRET () {
    return process.env.JWT_SECRET || 'JWT_SECRET'
  }

  static get SENTRY_DSN () {
    return process.env.SENTRY_DSN || ''
  }

  static get MQTT_BROKER() {
    return process.env.MQTT_BROKER || 'tcp://broker.mqtt.cool:1883'
  }

  static get MQTT_TOPIC_UPDATE_UDE() {
    return process.env.MQTT_TOPIC_UPDATE_UDE || 'update_ude'
  }

  static get MQTT_TOPIC_REQUEST_DATA() {
    return process.env.MQTT_TOPIC_REQUEST_DATA || 'request_realtime_data'
  }

  static get MQTT_TOPIC_RESPONSE_DATA() {
    return process.env.MQTT_TOPIC_RESPONSE_DATA || 'response_realtime_data'
  }
}