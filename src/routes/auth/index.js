const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const login = require('./loginIn')

router.post("/login", validator('body',login.rule), login.handler)


module.exports = router