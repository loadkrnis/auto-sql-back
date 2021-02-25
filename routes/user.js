const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;

/*
[POST] /commit/:erdName
{
    "hashedEmail": "hashedEmail"
}
*/
router.post('/', function (req, res, next) {
  let hashedEmail = req.body.hashedEmail;
  Users.create(
    {
      hashed_email: hashedEmail
    }
  ).then((result) => {
    res.json({
      code: 200,
      result: result // USERS테이블에 생성된 튜블 값
    });
  }).catch((err) => {
    console.error(err);
    res.status(400).json({
      code: 400,
      err
    });
  });
})

module.exports = router;
