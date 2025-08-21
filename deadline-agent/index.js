// deadline-agent/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { requireScopes } = require('../shared/verify');
const { logAction } = require('../shared/audit');
const { signReceipt } = require('../receipts/signReceipt');

const app = express();
app.use(bodyParser.json());

/**
 * POST /v1/calendar/events
 * Body: { deadlines: [{deadline:"YYYY-MM-DD", title:"..."}] }
 * Scope required: calendar.write
 * Requires delegated sub for real calendar ops (demo accepts sub in token)
 */
app.post('/v1/calendar/events', requireScopes(['calendar.write']), (req, res) => {
  const { deadlines } = req.body;
  if (!Array.isArray(deadlines)) return res.status(400).json({ error: 'Missing deadlines array' });

  // Mock calendar event creation
  const events = deadlines.map((d, i) => ({ id: `evt-${Date.now()}-${i}`, title: d.title || 'Deadline', date: d.deadline }));

  // Sign a receipt (JWS)
  const receipt = signReceipt({
    iss: process.env.SERVICE_ID || 'deadline-agent',
    aud: 'audit',
    azp: req.auth.azp,
    sub: req.auth.sub,
    action: 'create_events',
    resource: 'calendar',
    result: { events }
  });

  logAction({ agent: 'deadline', azp: req.auth.azp, sub: req.auth.sub, action: 'create_events', scope: req.auth.scopes.join(' '), resource: 'calendar', payload: events, receipt });

  res.json({ events, receipt });
});

const PORT = process.env.DEADLINE_PORT || 3002;
app.listen(PORT, () => console.log(`Deadline Agent listening on ${PORT}`));
