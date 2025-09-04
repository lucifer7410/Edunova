const express = require("express");
const router = express.Router();
const { requireScope } = require("../utils/descopeAuth");
const { addDeadlines } = require("../agents/deadlineAgent");

router.post("/", requireScope("calendar.write"), addDeadlines);

module.exports = router;
