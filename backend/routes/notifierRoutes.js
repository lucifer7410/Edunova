const express = require("express");
const router = express.Router();
const { requireScope } = require("../utils/descopeAuth");
const { sendReminder } = require("../agents/notifierAgent");

router.post("/", requireScope("messaging.send"), sendReminder);

module.exports = router;
