import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import initializeDB from "../db.js";

const router = express.Router();
const JWT_SECRET = "secretkey"; // Change later

router.post("/register", async (req, res) => {
  try {
    const db = await initializeDB();
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Email already registered or DB error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = await initializeDB();
    const { email, password } = req.body;

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
