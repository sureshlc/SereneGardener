var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/meet-the-team', function(req, res, next) {
  console.log("Accessing Meet the Team page");
  res.render('meet-the-team'); // Render meet-the-team.ejs
});

router.get('/discover', function(req, res, next) {
  console.log("Accessing discover page");
  res.render('discover'); // Render meet-the-team.ejs
});

module.exports = router;
