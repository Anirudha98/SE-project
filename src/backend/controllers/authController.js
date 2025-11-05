const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let users = [];

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existing = users.find((u) => u.email === email);
  if (existing)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, name, email, password: hashed };
  users.push(newUser);

  res.status(201).json({ message: "Registration successful" });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, "secretKey", {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
};
