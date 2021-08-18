const express = require('express');
const router = express.Router();
const Shared = require('../models').shared;
const SharedErds = require('../models').shared_erds;
const SharedUsers = require('../models').shared_users;
const axios = require('axios');
const { authOnlyAccessToken } = require('../middlewares/authMiddleware');

router.post('/:erdName', authOnlyAccessToken, async (req, res) => {
  const userId = req.hashedEmail;
  const erdId = req.body.erd_id;
  const sharedName = req.body.shared_name;
  const teamList = req.body.team_list; // ['asd@asd.com', 'dsa@dsa.com'] -> 만든사람 제외
  const shared = await Shared.create({
    name: sharedName,
    user_id: userId
  }).then(result => result);
  await SharedErds.create({
    shared_id: shared.id,
    erd_id: erdId
  }).catch(err => {
    console.log(err);
  });
  await SharedUsers.create({
    user_id: req.hashedEmail,
    shared_id: shared.id
  });
  const sucessList = {};
  await teamList.forEach(async userEmail => {
    await axios.post('https://node.meum.me/verify/autosql/invite', {
      email: userEmail,
      shared_name: sharedName,
      shared_id: shared.id,
    }).then(async (res) => {
      if (res.status == 200) {
        sucessList[userEmail.split('@')[0]] = true;
      } else {
        sucessList[userEmail.split('@')[0]] = false;
      }
    });
  });

  res.json({ code: 200, result: sucessList });
});

router.get('/invite/:user_id/:shared_id', async (req, res) => {
  const user_id = req.params.user_id;
  const shared_id = req.params.shared_id;
  const check = await SharedUsers.count({
    where: {
      user_id: user_id,
      shared_id: shared_id
    }
  });
  if (check == 0) {
    SharedUsers.create({
      user_id: user_id,
      shared_id: shared_id
    }).catch(err => {
      console.error(err);
      res.json(err);
    });
  }
  res.redirect('https://erd.autosql.co.kr');
});
module.exports = router;
