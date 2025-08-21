// scripts/generate_token.js
const fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync('./keys/private.pem', 'utf8');

function gen({ iss='dev-issuer', aud='agent-deadline', azp='agent-digest', scope='calendar.write', sub='user123', expiresIn='1h' } = {}) {
  const payload = { iss, aud, azp, scope, sub, jti: 'jti-' + Date.now() };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn });
}

if (require.main === module) {
  const scope = process.argv[2] || 'calendar.write';
  const aud = process.argv[3] || 'agent-deadline';
  const azp = process.argv[4] || 'agent-digest';
  const sub = process.argv[5] || 'user123';
  const token = gen({ scope, aud, azp, sub });
  console.log(token);
}

module.exports = gen;
