module.exports = {
  configure: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const connect = require('mqtt').connect;

        const remote = connect(process.env.MQTT_REMOTE_BROKER);
        const local = connect(process.env.MQTT_LOCAL_BROKER);

        let remoteConnected = false;
        let remoteError = false;
        let localConnected = false;
        let localError = false;

        // Configure remote broker
        remote.on('connect', async () => {
          remote.subscribe(`${process.env.MQTT_TOPIC_PREFIX}/#`, (error) => {
            if (error) {
              console.error('Fail to subscribe to REMOTE broker');
              console.error(error);
              remoteError = error;
              return
            }
            remoteConnected = true;
          });
        });

        remote.on('message', (topic, message) => {
          const json = JSON.parse(message.toString());

          if (json.from_proxy) {
            return
          }
          console.log(`Received message from REMOTE broker on topic: ${topic}`);

          json.from_proxy = true;
          const payload = JSON.stringify(json);
          local.publish(topic, payload);
        });

        remote.on('error', async (error) => {
          if (error) {
            console.error(error);
            remoteError = error;
          }
        });

        // Configure local broker
        local.on('connect', async () => {
          local.subscribe(`${process.env.MQTT_TOPIC_PREFIX}/#`, (error) => {
            if (error) {
              console.error('Fail to subscribe to LOCAL broker');
              console.error(error);
              localError = error;
              return
            }
            localConnected = true;
          });
        });

        local.on('message', (topic, message) => {
          const json = JSON.parse(message.toString());

          if (json.from_proxy) {
            return
          }
          console.log(`Received message from LOCAL broker on topic: ${topic}`);

          json.from_proxy = true;
          const payload = JSON.stringify(json);
          remote.publish(topic, payload);
        });

        local.on('error', async (error) => {
          if (error) {
            console.error(error);
            localError = error;
          }
        });

        while (!remoteConnected || !localConnected || remoteError || localError) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (remoteError || localError) {
          reject('Fail to configure proxy');
          return
        }

        resolve({ remote, local })
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}