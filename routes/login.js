const express = require('express');
const router = express.Router();
/* GET users listing. */
router.get('/', function (req, res) {
  res.send('/login 에 get 요청입니다.');
});
module.exports = router;
