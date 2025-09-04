import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.NOTIFIER_PORT || 5003;
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

app.post("/api/notify", authenticate, (req, res) => {
  const { message, channel } = req.body;
  res.json({ status: `Notification sent to ${channel}`, message });
});

app.listen(PORT, () => console.log(`✅ Notifier Agent running on port ${PORT}`));
