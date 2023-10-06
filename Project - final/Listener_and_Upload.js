const mqtt = require('mqtt');
const mongoose = require('mongoose');

const MQTT_BROKER_URL = 'mqtt://broker.hivemq.com:1883';
const MQTT_TOPIC = 'smart_lighting';

const MONGO_URI = 'mongodb+srv://hhassanzada:Hassan00278@cluster0.yewruja.mongodb.net/?retryWrites=true&w=majority';
// We create a mqtt client to connect to
const MQTTClient = mqtt.connect(MQTT_BROKER_URL);

// Defineing schema for the smart lighting data
// The data consists of a state (on or off)
// And a time stamp
const smartLightingSchema = new mongoose.Schema({
  state: Number,
  timestamp: Date,
});

const Lighting = mongoose.model('Lighting', smartLightingSchema);

// Connecting to client
MQTTClient.on('connect', () => {
  console.log('====== Connected to MQTT broker ======');

  // Subscribe to the MQTT topic to receive messages
  MQTTClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('Subscribing to MQTT topic UNSUCCESSFUL:', err);
    } else {
      console.log('========= Subscribed to MQTT topic:', MQTT_TOPIC , ' ===========');
    }
  });
});

// he were we will Handle incoming MQTT messages
MQTTClient.on('message', (topic, message) => {
  console.log('==== Received message on topic:', topic , ' ====');
  console.log('Message:', message.toString());
  console.log('\n');

  // Parsing the data from mqtt to JSON
  const lightData = JSON.parse(message.toString());

  // We will use mongoose and api to connect to mongodb database
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  console.log('\n');
  db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  db.once('open', () => {
    console.log('====== Connected to MongoDB =======');

    // Inserting the data into the 'lightings' collection 
    Lighting.insertMany(lightData)
      .then((result) => {
        console.log(`====== Successfully Inserted ${result.length} rows of data into Lighting collection ======`);
        // We close the mongo connection
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error('Error inserting data into MongoDB:', err);
        // We close the mongo connection
        mongoose.connection.close();
      });
  });
});
