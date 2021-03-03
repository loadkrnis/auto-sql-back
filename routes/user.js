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

router.delete('/:hashedEmail', authOnlyAccessToken, async (req, res, next) => {
  let hashedEmail = req.params.hashedEmail;
  //authToken과 hashedEmail 값 비교
  if (req.hashedEmail != hashedEmail) {
    res.status(400).json({
      code: 400,
      message: "get으로 보낸 hashedEmail과 토큰의 hashedEmail이 일치하지 않습니다."
    });
  }
  //erd_commits => 
  //erds 먼저 삭제해야함 
  //shared_users도 삭제해야함
  // Erds.findAll
  await Erds.destroy({
    where: { user_id: hashedEmail }
  }).catch((err) => {
    console.error(err);
    res.status(400).json({
      code: 400,
      err
    });
  });

  Users.destroy({
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
