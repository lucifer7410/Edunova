const express = require("express");
const router = express.Router();
const { requireScope } = require("../utils/descopeAuth");
const { suggestStudyPlan } = require("../agents/plannerAgent");

router.post("/", requireScope("schedule.suggest"), suggestStudyPlan);

module.exports = router;
