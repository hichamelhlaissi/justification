const express = require('express');
const router = express.Router();
const textCheck = require('../src/controllers/textCheck.controller')

router.post('', textCheck.checkText_post);
router.get('/limit', textCheck.getLimit_get);
module.exports = router;
