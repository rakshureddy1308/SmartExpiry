const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    stock: { type: Number, required: true },
    sales: { type: Number, required: true },
    category: { type: String, enum: ["A", "B", "C"], default: "C" },
    discount: { type: Number, default: 0 },
    qrCodeUrl: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
