import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.MOTIVATOR_PORT || 5004;
const SECRET = process.env.JWT_SECRET || "test-secret";

function authenticate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token" });
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/api/motivate", authenticate, (req, res) => {
  const tips = [
    "Stay hydrated 💧",
    "Take a 5 min break every hour ⏳",
    "Review notes after class 📘"
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.json({ motivation: tip });
});

app.listen(PORT, () => console.log(`✅ Motivator Agent running on port ${PORT}`));
