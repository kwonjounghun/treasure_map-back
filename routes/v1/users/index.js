const express = require("express");
const router = express.Router();
const joinIn = require("./joinIn");

router.post("/joinIn", joinIn);

module.exports = router;
