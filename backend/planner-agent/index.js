import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PLANNER_PORT || 5006;
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

app.post("/api/plan", authenticate, (req, res) => {
  const { deadlines } = req.body;
  const plan = deadlines.map(d => ({
    ...d,
    studySlots: [
      { date: new Date(new Date(d.date).getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), task: "Review notes" },
      { date: new Date(new Date(d.date).getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), task: "Mock test" }
    ]
  }));
  res.json({ plan });
});

app.listen(PORT, () => console.log(`✅ Planner Agent running on port ${PORT}`));
