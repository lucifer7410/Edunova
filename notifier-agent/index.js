// notifier-agent/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { requireScopes } = require('../shared/verify');
const { logAction } = require('../shared/audit');

const app = express();
app.use(bodyParser.json());

/**
 * POST /v1/notify
 * Body: { eventId: "...", message: "...", channels: ["console","email"] }
 * Scope required: messaging.send
 */
app.post('/v1/notify', requireScopes(['messaging.send']), async (req, res) => {
  const { eventId, message, channels = ['console'] } = req.body;
  // Mock sending: console log and pretend to send email/SMS
  channels.forEach(ch => {
    if (ch === 'console') console.log(`[Notifier] to console: (${eventId}) ${message}`);
    else console.log(`[Notifier] pretend sending to ${ch}: (${eventId}) ${message}`);
  });

  logAction({ agent: 'notifier', azp: req.auth.azp, sub: req.auth.sub, action: 'notify', scope: req.auth.scopes.join(' '), resource: 'message', payload: { eventId, message, channels } });

  res.json({ ok: true, sentTo: channels });
});

const PORT = process.env.NOTIFIER_PORT || 3003;
app.listen(PORT, () => console.log(`Notifier Agent listening on ${PORT}`));
