const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const Product = require("./models/Product");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.zhv4b.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "venomous202003@gmail.com",
    pass: "zgeh kjet mbjq oyrz",
  },
});

// Calculate discount based on expiry date
const calculateDiscount = (product) => {
  const expiryDate = new Date(product.expiryDate);
  const currentDate = new Date();
  const timeDiff = expiryDate - currentDate;
  const daysToExpiry = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (daysToExpiry <= 30) {
    return 40; // Category A
  } else if (daysToExpiry <= 60) {
    return 20; // Category B
  } else {
    return 10; // Category C
  }
};

// Check if expiry is near (within 30 days)
const isExpiryNear = (expiryDate) => {
  const currentDate = new Date();
  const dateDiff = new Date(expiryDate) - currentDate;
  return dateDiff <= 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
};

// Send email notification
const sendExpiryEmail = (product) => {
  const mailOptions = {
    from: "venomous202003@gmail.com",
    to: "rakshureddy1308@gmail.com",
    subject: `Discount Alert: ${product.name}`,
    text: `Hello,\n\nThe product ${product.name} (Category: ${product.category}) is nearing expiry on ${product.expiryDate}. Please apply a discount of ${product.discount}% to it.\n\nThank you!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// API to get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// API to update product stock and discount
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const product = await Product.findById(id);
    product.stock = stock;
    product.discount = calculateDiscount(product);
    await product.save();

    // Send expiry email if near expiry
    if (isExpiryNear(product.expiryDate)) {
      sendExpiryEmail(product);
    }

    // Generate new QR code URL
    QRCode.toDataURL(
      `http://localhost:3000/product/${product._id}`,
      (err, url) => {
        if (err) throw err;
        product.qrCodeUrl = url;
        product.save().then(() => {
          res.json(product);
        });
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
