const dotenv = require('dotenv')
dotenv.config()

const server = require('./server');
const proxy = require('./proxy');

; (async () => {
  await server.start()

  await proxy.configure()

  console.log('MQTT Proxy started')
})()