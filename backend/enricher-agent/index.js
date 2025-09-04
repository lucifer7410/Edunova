import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.ENRICHER_PORT || 5005;
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

function enrich(deadlines) {
  return deadlines.map(d => ({
    ...d,
    dayOfWeek: new Date(d.date).toLocaleDateString("en-US", { weekday: "long" }),
    tags: d.title.toLowerCase().includes("exam") ? ["exam", "urgent"] : ["assignment"],
    reminder: new Date(new Date(d.date).getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }));
}

app.post("/api/enricher", authenticate, (req, res) => {
  const { deadlines } = req.body;
  res.json({ enriched: enrich(deadlines || []) });
});

app.listen(PORT, () => console.log(`✅ Enricher Agent running on port ${PORT}`));
