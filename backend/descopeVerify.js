// descopeVerify.js
import { createRemoteJWKSet, jwtVerify } from "jose";
import dotenv from "dotenv";
dotenv.config();

const JWKS_URL = `$process.env.https://api.descope.com/v1/apps/P31USyajCKcLVxBCEKUP5HaMAiNi/.well-known/jwks.json`;
// createRemoteJWKSet will fetch public keys and cache them
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

function parseScopes(payload) {
  if (!payload) return [];
  if (Array.isArray(payload.scp)) return payload.scp;
  if (typeof payload.scope === "string") return payload.scope.split(" ").filter(Boolean);
  return [];
}

/**
 * Middleware factory: requireScopes(["messaging.send"])
 */
export function requireScopes(requiredScopes = []) {
  return async (req, res, next) => {
    try {
      const auth = req.headers.authorization || "";
      const parts = auth.split(" ");
      if (parts[0] !== "Bearer" || !parts[1]) {
        return res.status(401).json({ error: "missing_bearer_token" });
      }
      const token = parts[1];

      // jwtVerify will verify signature using JWKS
      const { payload } = await jwtVerify(token, JWKS /*, { issuer: optional, audience: optional } */);

      const granted = parseScopes(payload);
      const ok = requiredScopes.every(s => granted.includes(s));
      if (!ok) {
        return res.status(403).json({ error: "insufficient_scope", required: requiredScopes, granted });
      }

      // expose auth info for handlers
      req.auth = {
        sub: payload.sub,
        azp: payload.azp,
        scope: granted,
        raw: payload,
      };
      next();
    } catch (err) {
      return res.status(401).json({ error: "invalid_token", details: err.message });
    }
  };
}
