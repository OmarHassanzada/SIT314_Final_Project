const mqtt = require('mqtt');

const MQTT_BROKER_URL = 'mqtt://broker.hivemq.com:1883'; // HiveMQ public broker
const MQTT_TOPIC = 'smart_lighting';

// Function to generate random 0 or 1
function getOnOffState() {
  return Math.round(Math.random());
}

// Random generation of a timestamp 
// Up to 1 hour ago
function getTimestamp() {
  const nowTime = new Date();
  const randomMillis = Math.floor(Math.random() * 60 * 60 * 1000); 
  const randomTime = new Date(nowTime - randomMillis);
  return randomTime;
}

// collates the time stamp and on and off state to generate random data
function generateData(NoLights) {
  const data = [];
  for (let i = 0; i < NoLights; i++) {
    const state = getOnOffState();
    const timestamp = getTimestamp();
    data.push({ state, timestamp });
  }
  return data;
}

// Create an MQTT client
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on('connect', () => {
  console.log('====== Connected to MQTT broker ======');

  // Publish  data to MQTT
  // we use 1000 lights to simulate large buidlings
  const randData = generateData(1000); 
  mqttClient.publish(MQTT_TOPIC, JSON.stringify(randData), (err) => {
    if (err) {
      console.error('Error publishing data: ', err);
    } else {
      console.log('================ Data successfully published to MQTT topic:', MQTT_TOPIC , ' ===============');
    }
    
    mqttClient.end();
  });
});
