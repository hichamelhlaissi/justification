const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'justification - /api/signIn for sign in, and /api/gettext to test the app' });
});

module.exports = router;
