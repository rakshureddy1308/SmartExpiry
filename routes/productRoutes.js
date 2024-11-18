const express = require("express");
const Product = require("../models/productSchema");
const router = express.Router();

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).send("Error fetching products");
  }
});

// Get products by category (A, B, or C)
router.get("/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(400).send("Error fetching products by category");
  }
});

// Update stock for a product
router.put("/update-stock/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).send("Error updating stock");
  }
});

// Update discount for a product
router.put("/update-discount/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { discount: req.body.discount },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).send("Error updating discount");
  }
});

module.exports = router;
