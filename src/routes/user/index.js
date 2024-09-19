const express = require("express");
const router = express.Router();
const validator = require("../../helpers/validator");
const { authenticateToken } = require("../../middleware/auth.middleware");

const post = require("./post");
const get = require("./get");
const getById = require("./getById");
const update = require("./update");
const deleted = require("./delete");

router.post("/add", validator("body", post.rule), post.handler);

router.post("/get", authenticateToken,validator("body", get.rule), get.handler);

router.post("/getById", authenticateToken,validator("body", getById.rule),getById.handler);

router.post("/update", authenticateToken,validator("body", update.rule),update.handler);

router.post("/delete", authenticateToken,validator("body", deleted.rule),deleted.handler);

module.exports = router;