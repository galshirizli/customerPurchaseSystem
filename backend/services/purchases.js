const Purchase = require('../modules/purchases');
const mongoose = require('mongoose')

// This function fetches all users' purchase records from the database
async function getAllUsersBuys() {
    try {
        console.log("------------- service before -------------");
        console.log("getAllUsersBuys: ");
        const purchases = await Purchase.find();
        console.log("------------- service after -------------");
        console.log("getAllUsersBuys: " + purchases);
        return purchases;
    } catch (error) {
        console.error('Error fetching all purchases:', error);
        throw error;
    }
}

// This function fetches purchase records for a specific user from the database
async function getAllUserBuys(userid) {
    try {
        console.log("------------- service before -------------");
        console.log("getAllUserBuys: " + userid);
        const userPurchases = await Purchase.find({ userid: userid });
        console.log("------------- service after -------------");
        console.log("userPurchases: " + userPurchases);
        return userPurchases;
    } catch (error) {
        console.error('Error fetching user purchases:', error);
        throw error;
    }
}

// This function calculates the total price of purchases made by a specific user
async function getTotalPriceByUser(userid) {
    try {
        const userPurchases = await getAllUserBuys(userid);

        // Calculate the total price
        const totalPrice = userPurchases.reduce((sum, userPurchases) => sum + userPurchases.price, 0);

        return totalPrice;
    } catch (error) {
        console.error('Error calculating total price:', error);
        throw error;
    }
}

// This function adds a new purchase to the database
async function addPurchase(purchaseData) {
    try {

        // Ensure all required fields are present and valid
        if (!purchaseData.username || !purchaseData.userid || !purchaseData.price || !purchaseData.timestamp) {
            throw new Error('Missing required fields');
        }
        console.log("------------- service before -------------");
        console.log("purchaseData: " + purchaseData);
        const newPurchase = new Purchase(purchaseData);
        console.log("------------- service before -------------");
        console.log("newPurchase: " + newPurchase);
        await newPurchase.save();
        return newPurchase;
    } catch (error) {
        console.error('Error adding purchase:', error);
        throw error;
    }
}

// Export the functions to be used in other parts of the application
module.exports = {
    getAllUsersBuys,
    getAllUserBuys,
    addPurchase,
    getTotalPriceByUser
}