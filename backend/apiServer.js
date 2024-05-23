const express = require('express');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const cors = require('cors');
const purchasesController = require('./controllers/purchases')

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins

const MONGO_URI = 'mongodb://db:27017/store'
const PORT = '3000'


// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
  connectionTimeout: 30000,  
  requestTimeout: 30000,
  retries: 10
});

// Create a consumer
const consumer = kafka.consumer({ groupId: 'my-group' })

// Function to run the Kafka consumer
// Connects to the Kafka broker, subscribes to the specified topic,
// and processes each message by calling the purchasesController.addPurchase function
const runConsumer = async () => {
    await consumer.connect();
    console.log("------------- API -------------");
    console.log("Kafka connected")
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = message.value.toString();
        console.log("data consume: " + data);
        // Call the function to add the data to the database
        await purchasesController.addPurchase(data);
      },
    });
  };
  
runConsumer().catch(console.error);

// Route to get all users' purchase records from the controller and send the response as JSON
app.get('/getAllUsersBuys', async (req, res) => {
    try {
      console.log("------------- API -------------");
      console.log("getAllUsersBuys: ");
      const purchases = await purchasesController.getAllUsersBuys(); 
      res.json(purchases); 
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch purchases' }); 
    }
  });
  
// Route to get purchases for a specific user from the controller based on the request and send the response as JSON
app.get('/getAllUserBuys', async (req, res) => {
    try {
      console.log("------------- API -------------");
      console.log("getAllUserBuys");
      const purchases = await purchasesController.getAllUserBuys(req); 
      console.log("apiServer " + purchases); 
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch purchases' }); 
    }
  });



// Start the server and listen on port 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is listening on port ${PORT}`);
  });

