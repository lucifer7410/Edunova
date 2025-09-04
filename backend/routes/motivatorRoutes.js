const express = require("express");
const router = express.Router();
const { requireScope } = require("../utils/descopeAuth");
const { sendMotivation } = require("../agents/motivatorAgent");

router.post("/", requireScope("messaging.send"), sendMotivation);

module.exports = router;

