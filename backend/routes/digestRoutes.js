const express = require("express");
const router = express.Router();
const { requireScope } = require("../utils/descopeAuth");
const { handleDocument } = require("../agents/digestAgent");

router.post("/", requireScope("docs.read"), handleDocument);

module.exports = router;
