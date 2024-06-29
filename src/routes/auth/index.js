const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const signIn = require('./signIn')
const login = require('./loginIn')
const me = require('./me')


router.post("/login", validator('body',signIn.rule), signIn.handler)

router.post("/auth-login", validator('body',login.rule), login.handler)

router.post("/me", me.handler)


module.exports = router