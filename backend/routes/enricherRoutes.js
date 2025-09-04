const express = require("express");
const router = express.Router();
const { requireScope } = require("../utils/descopeAuth");
const { enrich } = require("../agents/enricherAgent");

router.post("/", requireScope("docs.read"), enrich);

module.exports = router;
