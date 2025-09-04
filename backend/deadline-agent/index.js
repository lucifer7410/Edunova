// deadline-agent/index.js
import express from "express";
import dotenv from "dotenv";
import { requireScopes } from "../descopeVerify.js";  // adjust path as needed

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.DEADLINE_PORT || 5002;

// Example protected route: requires scope 'deadlines.extract'
app.post("/api/deadline", requireScopes(["deadlines.extract"]), (req, res) => {
  const { text } = req.body;
  // simple demo extraction
  res.json({
    deadlines: [
      { title: "Extracted from text", date: "2025-09-01" },
      { title: "Exam", date: "2025-09-15" }
    ],
    requestedBy: req.auth // for audit visibility
  });
});

app.listen(PORT, () => console.log(`✅ Deadline Agent running on port ${PORT}`));
