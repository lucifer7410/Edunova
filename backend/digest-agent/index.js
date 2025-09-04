import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.DIGEST_PORT || 5001;
const SECRET = process.env.JWT_SECRET || "test-secret";

// Middleware: validate token
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Route: summarize content
app.post("/api/digest", authenticate, (req, res) => {
  const { content } = req.body;
  res.json({ summary: `This is a summary of: ${content?.slice(0, 50)}...` });
});

app.listen(PORT, () => console.log(`✅ Digest Agent running on port ${PORT}`));
