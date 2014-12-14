var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'DOMINION' });
});

/* GET static play page. */
router.get('/game', function(req, res) {
  res.render('game', { title: 'Game Page' });
});

module.exports = router;
