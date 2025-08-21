// shared/verify.js
const fs = require('fs');
const jwt = require('jsonwebtoken');

const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH || './keys/public.pem';
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');

/**
 * verifyToken: verifies RS256 token against local public key.
 * In prod: replace with JWKS verification (jwks-rsa / jose) and validate iss/aud.
 */
function verifyTokenLocal(token){
  try{
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function requireScopes(requiredScopes = []) {
  return (req, res, next) => {
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const { ok, payload, error } = verifyTokenLocal(token);
    if (!ok) return res.status(401).json({ error: 'Invalid token', detail: error.message });

    // Optional: enforce audience/issuer by env flags
    if (process.env.ENFORCE_ISS && payload.iss !== process.env.ISSUER) {
      return res.status(401).json({ error: 'Invalid issuer' });
    }
    if (process.env.ENFORCE_AUD && payload.aud !== (process.env.SERVICE_AUD || req.hostname)) {
      return res.status(401).json({ error: 'Invalid audience' });
    }

    const tokenScopes = (payload.scope || '').split(/\s+/).filter(Boolean);
    const okScopes = requiredScopes.every(s => tokenScopes.includes(s));
    if (!okScopes) return res.status(403).json({ error: 'Missing required scope' });

    req.auth = { raw: payload, azp: payload.azp, sub: payload.sub, scopes: tokenScopes, jti: payload.jti };
    next();
  };
}

module.exports = { requireScopes, verifyTokenLocal };
