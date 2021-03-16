const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const SharedUsers = require('../models').shared_users;
const SharedErds = require('../models').shared_erds;
const Shared = require('../models').shard;
const { auth, authOnlyAccessToken } = require('./authMiddleware');

/*
[POST] /user
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

/*
[DELETE] /user/:hashedEmail
*/
router.delete('/:hashedEmail', authOnlyAccessToken, async (req, res, next) => {
  let hashedEmail = req.params.hashedEmail;
  //authToken과 hashedEmail 값 비교
  if (req.hashedEmail != hashedEmail) {
    res.status(400).json({
      code: 400,
      message: "get으로 보낸 hashedEmail과 토큰의 hashedEmail이 일치하지 않습니다."
    });
  }
  //user가 생성한 shared_id 저장
  let selectShared = await Shared.findAll({ where: { user_id: hashedEmail } })
    .then((result) => { return result.map((val) => val.id); });
  if (selectShared != 0) {
    await SharedUsers.destroy({ where: { shared_id: selectShared } });
    await SharedErds.destroy({ where: { shared_id: selectShared } });
  }
  await Shared.destroy({where: {user_id:hashedEmail}});
  let selectErdIds = await Erds.findAll({ where: { user_id: hashedEmail } })
    .then((result) => { return result.map((val) => val.id) });
  await ErdCommits.destroy({ where: { erd_id: selectErdIds } });
  await Erds.destroy({ where: { user_id: hashedEmail } });
  //유저가 공유받은 erd
  await SharedUsers.destroy({ where: { user_id: hashedEmail } }); 
  Users.destroy({ where: { hashed_email: hashedEmail } })
  .then((result) => {
    res.json({
      code: 200,
      result: result // USERS테이블에 삭제된 튜플 갯수
    });
  })
});

module.exports = router;
