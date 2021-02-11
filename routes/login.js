var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('/login 에 get 요청입니다.');
});
module.exports = router;