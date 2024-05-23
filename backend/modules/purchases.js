const mongoose = require('mongoose')

// Define the schema for purchases
const purchasesSchema = new mongoose.Schema({
    username : {
      type: String,
      required: true
    },
    userid : {
      type: String,
      required: true
    },
    price : {
      type: Number,
      required: true
    },
    timestamp : {
      type: Date,
      required: true
    }
});

// Export the purchases model based on the purchasesSchema
module.exports = mongoose.model("purchases", purchasesSchema);


