// File: backend/utils/categorizeProducts.js

// Example logic for categorizing products into A, B, and C categories.
const categorizeProducts = (products) => {
  return products.map((product) => {
    let category = "C"; // Default category

    // ABC categorization logic (you can change this based on your requirements)
    if (product.sales > 200) {
      category = "A";
    } else if (product.sales > 100) {
      category = "B";
    }

    // Return product with its category
    return {
      ...product,
      category,
    };
  });
};

module.exports = categorizeProducts;
