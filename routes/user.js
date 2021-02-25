const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const { auth, authOnlyAccessToken } = require('./authMiddleware');
/*
[POST] /commit/:erdName
{
    "hashedEmail": "hashedEmail"
}
*/
router.post('/', (req, res, next) => {
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

router.delete('/:hashedEmail', authOnlyAccessToken, (req, res, next) => {
  let hashedEmail = req.params.hashedEmail;
  //authToken과 hashedEmail 값 비교
  Users.destory({
    where: { hashed_email: hashedEmail }
  }).then((result) => {
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
});

module.exports = router;
