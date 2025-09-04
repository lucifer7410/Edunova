const jwt = require("jsonwebtoken");

/**
 * verifyToken(token, requiredScope)
 * - In DEV: allows all tokens and logs scope checks.
 * - In PROD: replace with real Descope verification (JWKS).
 */
async function verifyToken(token, requiredScope) {
  const skip = process.env.DESCOPE_SKIP_VERIFY === "true";

  if (skip) {
    // Simulate decoded payload with required scopes for local testing
    return {
      sub: "agent-simulated",
      azp: "caller-simulated",
      iss: "descope-simulated",
      scopes: ["docs.read", "calendar.write", "messaging.send", "schedule.suggest", "fitness.read"]
    };
  }

  // TODO: Implement real Descope JWT verification using JWKS.
  // Example outline (pseudo):
  // 1) Fetch JWKS from process.env.DESCOPE_JWKS_URL
  // 2) Use kid from token header to get the right public key
  // 3) jwt.verify(token, publicKey, { issuer: ..., audience: ... })
  // 4) Ensure decoded.scopes includes requiredScope

  // For now, hard fail if not skipping.
  throw new Error("Descope verification not configured yet");
}

function requireScope(requiredScope) {
  return async (req, res, next) => {
    try {
      const auth = req.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
      if (!token) return res.status(401).json({ error: "Token required" });

      const decoded = await verifyToken(token, requiredScope);
      const scopes = decoded.scopes || [];
      if (!scopes.includes(requiredScope)) {
        return res.status(403).json({ error: `Scope '${requiredScope}' not authorized` });
      }

      req.agent = decoded; // attach identity for audit logs
      next();
    } catch (e) {
      res.status(403).json({ error: e.message || "Invalid token" });
    }
  };
}

module.exports = { verifyToken, requireScope };
