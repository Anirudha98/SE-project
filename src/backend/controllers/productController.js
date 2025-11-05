let products = require("./catalogController").products || [];

exports.addProduct = (req, res) => {
  const { name, price, artisan, description } = req.body;

  if (!name || !price || !artisan) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: Number(price),
    artisan,
    description: description || "",
  };

  products.push(newProduct);
  res.status(201).json({ message: "Product added successfully", product: newProduct });
};

exports.getProducts = () => products;
