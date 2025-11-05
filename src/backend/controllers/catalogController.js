// Temporary in-memory product list (you'll later connect to DB)
let products = [
    { id: 1, name: "Handmade Pottery Vase", price: 1200, artisan: "Meera", description: "Elegant clay vase with floral patterns" },
    { id: 2, name: "Woolen Scarf", price: 850, artisan: "Ravi", description: "Soft handwoven scarf with colorful patterns" },
    { id: 3, name: "Jute Tote Bag", price: 950, artisan: "Neha", description: "Eco-friendly and durable bag" },
];

// Controller methods
exports.getAllProducts = (req, res) => {
    const { search } = req.query;
    if (search) {
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
        return res.json(filtered);
    }
    res.json(products);
};