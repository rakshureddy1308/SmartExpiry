const express = require("express");
const joblib = require("joblib"); // Import joblib for loading the model
const router = express.Router();
const Product = require("../models/product");

const model = joblib.loadSync("path/to/your/saved/model"); // Load your trained model

router.get("/categorizeProducts", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database

    // Loop through each product to predict the category
    for (const product of products) {
      const { name, price, expiryDate, stock, sales } = product;
      const features = [price, stock, sales]; // Example features for prediction
      const category = model.predict([features])[0]; // Predict the category
      product.category = category; // Update the product with the new category
    }

    await Promise.all(products.map((product) => product.save())); // Save updated products to the database
    res.send(products); // Send updated products as response
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
