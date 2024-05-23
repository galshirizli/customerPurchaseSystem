const express = require('express')
const { Kafka } = require('kafkajs');
const path = require('path');
const app = express();
const axios = require('axios');

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Specify the folder where the view templates are located
app.use(express.json()); // Use the JSON middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
  connectionTimeout: 30000,  
  requestTimeout: 30000,
  retries: 10
});


// This endpoint renders the main page of the web server
// Initializes an empty array for purchases and passes it to the 'webServer' template
app.get('/', (req, res) => {
    const purchases = [];
    res.render('webServer', { purchases });
});


// This endpoint receives purchase data from the frontend and create Kafka produce,
// connects to the Kafka broker, sends the data to the specified topic,
// and disconnects from the broker
app.post('/sendData', async (req, res) => {
    console.log("------------- app.js /sendData -------------");
    console.log("Received req.body: ", req.body);
    const producer = kafka.producer()
    
    await producer.connect()
    console.log("Kafka connected");
    await producer.send({
      topic: 'my-topic',
      messages: [
        { value: JSON.stringify(req.body) },
      ],
    })
    console.log("Send to kafka");
    await producer.disconnect()
    console.log("Kafka disconnected");
});

app.get('/getAllUserBuys', async (req, res) => {
  try {
    const inputData = req.query.data;
    console.log("------- app.js getAllUserBuys before ---------")
    console.log("inputData: " + inputData)
    const response = await axios.get(`http://backend:3000/getAllUserBuys`, {
        params: {
            data: inputData
        }
    });
    console.log("------- app.js getAllUserBuys after ---------")
    console.log("response: " + response)
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching purchases from backend:', error);
    res.status(500).send('Error fetching purchases');
  }
});


app.get('/getAllUsersBuys', async (req, res) => {
  try {
    console.log("------- app.js getAllUsersBuys before ---------")
    const response = await axios.get('http://backend:3000/getAllUsersBuys');
    console.log("------- app.js getAllUserBuys after ---------")
    console.log("response: " + response)
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    res.status(500).send('Error fetching data');
  }
});

// Start the client and listen on port 80
app.listen(80, '0.0.0.0', () => {
  console.log(`App is listening on port 80`);
});


