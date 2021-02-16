var express = require('express');
var router = express.Router();
var Users = require('../models').users;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/select/:userId', function (req, res, next) {
  Users.findOne({
    where: {
      idx: req.params.userId
    },
  }).then((result) => {
    res.json(result);
  })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    });
});

router.post('/create/:userId', function (req, res, next) {
  res.send(req.params.userId);
})

module.exports = router;
