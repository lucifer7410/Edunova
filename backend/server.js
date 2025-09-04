import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SKIP_VERIFY = (process.env.DESCOPE_SKIP_VERIFY || "true") === "true";

// ---------- Auth middleware ----------
function auth(requiredScope) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    if (SKIP_VERIFY) {
      req.user = { sub: "dev-user", scopes: ["docs.read", "calendar.write", "messaging.send"] };
      return next();
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      if (requiredScope && !payload.scopes?.includes(requiredScope)) {
        return res.status(403).json({ error: `Missing required scope: ${requiredScope}` });
      }
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

// ---------- Health ----------
app.get("/health", (req, res) => res.json({ ok: true }));

// ---------- Digest Agent ----------
app.post("/api/digest", auth("docs.read"), (req, res) => {
  const { documentText = "" } = req.body || {};
  const summary = documentText.length
    ? `${documentText.slice(0, 160)}${documentText.length > 160 ? "..." : ""}`
    : "No content provided";

  const dateRegex = /\b(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/g;
  const deadlines = [...documentText.matchAll(dateRegex)].map((m, i) => ({
    title: `Deadline ${i + 1}`,
    date: m[0]
  }));

  res.json({ summary, deadlines });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
