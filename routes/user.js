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

  // user가 공유 받은 데이터 삭제
  await SharedUsers.destroy({ where: { user_id: hashedEmail } }); 
  
  //user가 생성한 shared_id 저장
  let selectShared = await Shared.findAll({
    where: { user_id: hashedEmail }
  }).then((share) => {
    if (share == null) return 0;
    let result = share.map((val) => val.id);
    return result;
  }); 
  
  //shared_erds의 erd_id 값 저장 필요

  //user가 생성한ERD의 
  await SharedErds.destroy({ where: { shared_id: selectShared } }); 
  await SharedUsers.destroy({ where: { shared_id: selectShared } });
  await Shared.destroy({ where: { user_id: hashedEmail } });

  // await Erds.destroy({
  //   where: { user_id: hashedEmail }
  // }).catch((err) => {
  //   console.error(err);
  //   res.status(400).json({
  //     code: 400,
  //     err
  //   });
  // });

  // Users.destroy({
  //   where: { hashed_email: hashedEmail }
  // }).then((result) => {
  //   res.json({
  //     code: 200,
  //     result: result // USERS테이블에 생성된 튜블 값
  //   });
  // }).catch((err) => {
  //   console.error(err);
  //   res.status(400).json({
  //     code: 400,
  //     err
  //   });
  // });
});

module.exports = router;
