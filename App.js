import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [scannedProduct, setScannedProduct] = useState(null);

  useEffect(() => {
    // Fetch products from the backend
    fetch(`${window.location.origin.replace(":3000", ":5000")}/api/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const updateStock = (id, newStock) => {
    fetch(
      `${window.location.origin.replace(":3000", ":5000")}/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(
          products.map((product) =>
            product._id === id
              ? { ...product, stock: newStock, discount: data.discount }
              : product
          )
        );
      })
      .catch((error) => console.error("Error updating stock:", error));
  };

  const handleScan = (data) => {
    try {
      const parsedData = JSON.parse(data);
      setScannedProduct(parsedData);
    } catch (err) {
      console.error("Invalid QR code data:", err);
      setScannedProduct(null);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#b6d9df",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#025e6f" }}>Product List</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #003b45",
          marginTop: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#63b3c2",
              color: "#003b45",
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            <th>Product</th>
            <th>Price</th>
            <th>Expiry Date</th>
            <th>Stock</th>
            <th>Sales</th>
            <th>Category</th>
            <th>Discount</th>
            <th>QR Code</th>
            <th>Update Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} style={{ borderBottom: "1px solid #003b45" }}>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {product.name}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                ${product.price}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {new Date(product.expiryDate).toLocaleDateString()}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {product.stock}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {product.sales}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {product.category}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {product.discount}%
              </td>
              <td style={{ textAlign: "center" }}>
                <QRCodeSVG
                  value={JSON.stringify({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    expiryDate: product.expiryDate,
                    stock: product.stock,
                    sales: product.sales,
                    discount: product.discount,
                    category: product.category,
                  })}
                  size={128} // Standardized size for all QR codes
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q" // Error correction level
                  style={{ margin: "10px" }}
                  onClick={() => handleScan(JSON.stringify(product))}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => updateStock(product._id, product.stock + 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007a8d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {product.stock}
                </span>
                <button
                  onClick={() => updateStock(product._id, product.stock - 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007a8d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Product details modal */}
      {scannedProduct && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #003b45",
            backgroundColor: "#f0f8f8",
            borderRadius: "5px",
            width: "50%",
            margin: "0 auto",
          }}
        >
          <h3 style={{ color: "#003b45", textAlign: "center" }}>
            Product Details
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Product:
                </td>
                <td style={{ padding: "5px" }}>{scannedProduct.name}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Price:
                </td>
                <td style={{ padding: "5px" }}>${scannedProduct.price}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Expiry Date:
                </td>
                <td style={{ padding: "5px" }}>
                  {new Date(scannedProduct.expiryDate).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Stock:
                </td>
                <td style={{ padding: "5px" }}>{scannedProduct.stock}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Sales:
                </td>
                <td style={{ padding: "5px" }}>{scannedProduct.sales}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Discount:
                </td>
                <td style={{ padding: "5px" }}>{scannedProduct.discount}%</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "5px",
                  }}
                >
                  Category:
                </td>
                <td style={{ padding: "5px" }}>{scannedProduct.category}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
