const express = require('express');
const router = express.Router();
const textCheck = require('../src/controllers/textCheck.controller')

router.post('', textCheck.checkText_post);

module.exports = router;
