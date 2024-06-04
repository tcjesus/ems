module.exports = {
  start: async () => {
    return new Promise((resolve, reject) => {
      try {
        const aedes = require('aedes')()
        const server = require('net').createServer(aedes.handle)

        const port = process.env.MQTT_LOCAL_PORT
        server.listen(port, () => {
          console.log(`MQTT Broker started on port ${port}`)
          resolve(server)
        })
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}