var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ message: `App responded at ${new Date().toISOString()}` });
});

module.exports = router;