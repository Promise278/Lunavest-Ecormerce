const fs = require('fs')
const products_gen = []
const PRODUCTS_FILE = "products.json";

function loadProducts() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
    return JSON.parse(data || "[]");
}

function saveProducts(products_gen) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products_gen, null, 2));
}


function generate_products(req, res) {
    const { title, description, price, status } = req.body;

    if (!title || !description || !price ||!status ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    let products = loadProducts();

    const newProducts = {
        id: products.length + 1,
        title: title,
        description: description,
        status: status,
        price: price,
        date: new Date(),
    }

    products.push(newProducts)
    saveProducts(products)

    return res.status(201).json({
        success: true,
        data: newProducts,
        message: "Products added successfully"
    })
}

function seeAllproducts(req, res) {
    let products = loadProducts();
    if (products.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No Products found"
        })   
    }
    return res.status(200).json({
        success: true,
        data: products,
        message: "Products retrived successfully"
    })
}

function deleteProducts(req, res) {
  const { id } = req.params;

  let products = loadProducts();

  const productIndex = products.findIndex(p => p.id === parseInt(id));

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  saveProducts(products);

  return res.status(200).json({
    success: true,
    data: deletedProduct,
    message: "Product deleted successfully",
  });
}


module.exports = { generate_products, seeAllproducts, deleteProducts };