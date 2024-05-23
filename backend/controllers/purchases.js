const purchasesService = require('../services/purchases')
const mongoose = require('mongoose')

// This function fetches all users' purchase records from the service 
// that gets all purchases from the database. 
async function getAllUsersBuys() {
    try {
        console.log("------------- controller before -------------");
        console.log("getAllUsersBuys: ");
        const purchases = await purchasesService.getAllUsersBuys();
        console.log("------------- controller after -------------");
        console.log("purchases: " + purchases);
        return(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
}

// This function fetches purchase records for a specific user from the service 
// based on the request data. 
async function getAllUserBuys(req) {
    const userid = req.query.data
    try {
        console.log("------------- controller before -------------");
        console.log("getAllUserBuys: " + userid);
        const userPurchases = await purchasesService.getAllUserBuys(userid);
        console.log("------------- controller after -------------");
        console.log("userPurchases : " + userPurchases);
        return(userPurchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
    }
}

// This function fetches the total price of purchases made by a specific user 
// from the service. 
async function getTotalPriceByUser(userid) {
    try {
        const totalPrice = await purchasesService.getTotalPriceByUser(userid);
    } catch (error) {
        console.error('Error fetching purchases:', error);
    }
}

// This function adds a new purchase to the database by sending the purchase data 
// to the service. 
async function addPurchase(purchaseData) {
    try {
        const data = JSON.parse(purchaseData)
        console.log("------------- controller before -------------");
        console.log("purchaseData: " + purchaseData);
        const newPurchase = await purchasesService.addPurchase(data);
        console.log("------------- controller before -------------");
        console.log("newPurchase: " + newPurchase);
    } catch (error) {
        console.error('Failed to add purchase:', error);
    }
}

// Export the functions to be used in other parts of the application
module.exports = {
    getAllUsersBuys,
    getAllUserBuys,
    addPurchase,
    getTotalPriceByUser
}