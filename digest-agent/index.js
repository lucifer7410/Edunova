// digest-agent/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { requireScopes } = require('../shared/verify');
const { logAction } = require('../shared/audit');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

/**
 * POST /v1/digest
 * Body: { text: "..." }
 * Scope required: docs.read
 * Returns: { summary, deadlines: [...], topics: [...] }
 */
app.post('/v1/digest', requireScopes(['docs.read']), async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const summary = text.slice(0, 1000);
  const deadlines = (text.match(/\d{4}-\d{2}-\d{2}/g) || []).map(d => ({ deadline: d, title: 'Auto-extracted' }));
  // Quick topic extraction: pull capitalized words (demo)
  const topics = Array.from(new Set((text.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || []).slice(0,10)));

  // Log
  logAction({ agent: 'digest', azp: req.auth.azp, sub: req.auth.sub, action: 'digest', scope: req.auth.scopes.join(' '), resource: 'document', payload: { summary, deadlines, topics } });

  res.json({ summary, deadlines, topics });
});

const PORT = process.env.DIGEST_PORT || 3001;
app.listen(PORT, () => console.log(`Digest Agent listening on ${PORT}`));
