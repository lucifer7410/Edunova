// motivator-agent/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { requireScopes } = require('../shared/verify');
const { logAction } = require('../shared/audit');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

/**
 * POST /v1/motivate
 * Body: { userId: "user123", upcomingEvents: [...] }
 * Scope required: motivation.send
 * This agent decides whether to send motivational nudges and calls Notifier Agent (actor must have messaging.send).
 */
app.post('/v1/motivate', requireScopes(['motivation.send']), async (req, res) => {
  const { userId, upcomingEvents } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  // Simple rule: if there's an event within 48 hours, nudge
  const now = new Date();
  const soon = (upcomingEvents || []).filter(e => {
    const d = new Date(e.date);
    return (d - now) <= (48 * 3600 * 1000) && (d - now) > 0;
  });
  const messages = [];
  for (const e of soon) {
    const msg = `Heads up: "${e.title}" is in less than 48 hours (${e.date}). Short study session recommended.`;
    messages.push({ event: e.id || 'evt', message: msg });
    // call Notifier Agent — in prod you'd authenticate with its messaging.send scope (here we simulate direct call)
    try {
      const NOTIFIER_URL = process.env.NOTIFIER_URL || 'http://localhost:3003/v1/notify';
      // For demo, require a messaging.send token from caller if we wanted full chain. Here we just CALL (assume tokens).
      await axios.post(NOTIFIER_URL, { eventId: e.id, message: msg, channels: ['console'] }, {
        headers: { Authorization: `Bearer ${req.headers.authorization?.replace(/^Bearer\s+/i,'') || ''}` }
      });
    } catch (err) {
      // ignore for demo
    }
  }

  logAction({ agent: 'motivator', azp: req.auth.azp, sub: req.auth.sub, action: 'motivate', scope: req.auth.scopes.join(' '), resource: 'motivation', payload: { count: messages.length } });

  res.json({ nudges: messages.length, messages });
});

const PORT = process.env.MOTIVATOR_PORT || 3005;
app.listen(PORT, () => console.log(`Motivator Agent listening on ${PORT}`));
