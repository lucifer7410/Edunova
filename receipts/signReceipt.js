// receipts/signReceipt.js
const fs = require('fs');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY_PATH = process.env.SERVICE_PRIVATE_KEY_PATH || './keys/private.pem';
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

function signReceipt({iss, aud, azp, sub, action, resource, result}) {
  const payload = {
    iss, aud, azp, sub, action, resource, result, iat: Math.floor(Date.now()/1000)
  };
  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '30d' });
  return token;
}

module.exports = { signReceipt };
