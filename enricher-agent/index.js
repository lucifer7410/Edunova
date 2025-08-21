// enricher-agent/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { requireScopes } = require('../shared/verify');
const { logAction } = require('../shared/audit');

const app = express();
app.use(bodyParser.json());

/**
 * POST /v1/enrich
 * Body: { topics: ["Quantum", "Thermodynamics"] }
 * Scope required: knowledge.expand
 */
app.post('/v1/enrich', requireScopes(['knowledge.expand']), async (req, res) => {
  const { topics } = req.body;
  if (!Array.isArray(topics)) return res.status(400).json({ error: 'Missing topics array' });

  // Demo: create mini digest for each topic (in prod use Claude / LLM)
  const enriched = topics.map(t => ({ topic: t, note: `Mini summary for ${t}. Key concepts and suggested reading.` }));

  logAction({ agent: 'enricher', azp: req.auth.azp, sub: req.auth.sub, action: 'enrich', scope: req.auth.scopes.join(' '), resource: 'topics', payload: enriched });

  res.json({ enriched });
});

const PORT = process.env.ENRICHER_PORT || 3004;
app.listen(PORT, () => console.log(`Enricher Agent listening on ${PORT}`));
