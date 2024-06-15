const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const signIn = require('./signIn')
const me = require('./me')


router.post("/login", validator('body',signIn.rule), signIn.handler)

router.post("/me", me.handler)


module.exports = router