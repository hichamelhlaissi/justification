const express = require('express');
const router = express.Router();
const signIn = require('../src/controllers/signIn.controller')

router.post('', signIn.signIn_post);

module.exports = router;
