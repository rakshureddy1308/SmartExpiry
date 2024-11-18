const QRCode = require("qrcode");

const generateQRCode = async (text) => {
  try {
    const url = await QRCode.toDataURL(text);
    return url; // This will be the base64 string for the QR code
  } catch (err) {
    console.error("Error generating QR code:", err);
    throw err;
  }
};

module.exports = generateQRCode;
