const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models').users;
const Erd = require('../models').erd;
const router = express.Router();
const { auth } = require('./authMiddleware');
require('dotenv').config();

router.post('/get/:userHash', async (req, res) => {
  try {
    Users.findOne({
      where: { idx: req.params.userHash }
    }).then((user) => {
      if (user == null) res.send("userHash:[" + req.params.userHash + "] is not exits.");

      Erd.findAll({
        where: { user_idx: user.idx }
      }).then((erd) => {
        const result = erd.map((val) => val.database_name);
        const token = jwt.sign({
          userIdx: user.idx,
          result:result
        }, process.env.JWT_SECRET, {
          expiresIn: '1m', // 1분
          issuer: '토큰발급자',
        });
        return res.json({
          code: 200,
          message: '토큰이 발급되었습니다.',
          token,
        });
      }).catch((err) => {
        console.error(err);
      })
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', auth, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;