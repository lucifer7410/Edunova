// generate-token.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "test-secret";

const payload = {
  user: "test-user",
  role: "student"
};

const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

console.log("✅ Your JWT token:");
console.log(token);
