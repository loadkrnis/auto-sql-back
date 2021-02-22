const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models').users;
const Erds = require('../models').erds;
const router = express.Router();
const { auth } = require('./authMiddleware');
require('dotenv').config();

/*
  [GET] erd/:hashedEmail
*/
router.get('/login/:hashedEmail', async (req, res) => {
  try {
    Users.findOne({
      where: { hashed_email: req.params.hashedEmail }
    }).then((user) => {
      if (user == null) res.status(400).send({ error: "hashedEmail:[" + req.params.hashedEmail + "] is not exits." });
      else {
          const accessToken = jwt.sign({
            type: 'ACCESS',
            hashed_email: req.params.hashedEmail
          }, process.env.JWT_SECRET, {
            expiresIn: '1m', // 1분
            issuer: '토큰발급자',
          });
          const refreshToken = jwt.sign({
            type: 'REFRESH',
            hashed_email: req.params.hashedEmail,
          }, process.env.JWT_SECRET, {
            expiresIn: '14d', // 14일
            issuer: '토큰발급자',
          });

          Users.update({ refresh_token: refreshToken },
            {
              where: { hashed_email: req.params.hashedEmail }
            }).then((result) => {
              res.json({
                code: 200,
                message: '토큰이 발급되었습니다.',
                accessToken,
                refreshToken,
              });
            }).catch((err) => {
              console.error("[GET] erd/:hashedEmail fail =>" + err);
              res.send("[GET] erd/:hashedEmail fail =>" + err);
            });
      }
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

router.get('/reissue', auth, (req, res) => {
  if (req.decoded.type != "REFRESH") {
    res.status(400).json({
      code: 400,
      message: '[Refresh]토큰이 아닙니다. 현재 토큰은 [' + req.decoded.type + ']토큰입니다.',
    });
  }
  Users.findOne({
    where: { hashed_email: req.decoded.hashedEmail }
  }).then((user) => {
    if (user.refresh_token != req.headers.authorization) {
      res.status(400).json({
        code: 400,
        message: '전달된 Refresh토큰이 유저의 저장된 Refresh토큰과 다릅니다.',
      });
    }
    const accessToken = jwt.sign({
      type: 'ACCESS',
      hashed_email: req.params.hashedEmail,
      result: result
    }, process.env.JWT_SECRET, {
      expiresIn: '1m', // 1분
      issuer: '토큰발급자',
    });
    res.json({
      code: 200,
      message: '토큰이 재발급되었습니다.',
      accessToken
    });
  });
});

module.exports = router;