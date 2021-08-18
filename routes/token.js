const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models').users;
const router = express.Router();
const { authOnlyRefreshToken } = require('../middlewares/authMiddleware');
require('dotenv').config();

/*
  [GET] erd/:hashedEmail
*/
router.get('/login/:hashedEmail', async (req, res) => {
  try {
    Users.findOne({
      where: { hashed_email: req.params.hashedEmail }
    }).then((user) => {
      if (user == null) {
        res.status(400).send({ error: 'hashedEmail:[' + req.params.hashedEmail + '] is not exits.' });
      } else {
        const accessToken = jwt.sign({
          type: 'ACCESS',
          hashed_email: req.params.hashedEmail
        }, process.env.JWT_SECRET, {
          expiresIn: '1d', // 1분
          issuer: '토큰발급자',
        });
        const refreshToken = jwt.sign({
          type: 'REFRESH',
          hashed_email: req.params.hashedEmail,
        }, process.env.JWT_SECRET, {
          expiresIn: '14d', // 14일
          issuer: '토큰발급자',
        });

        Users.update({ refresh_token: refreshToken }, {
          where: { hashed_email: req.params.hashedEmail }
        }).then(() => {
          res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            accessToken,
            refreshToken,
          });
        }).catch((err) => {
          console.error('[GET] erd/:hashedEmail fail =>' + err);
          res.send('[GET] erd/:hashedEmail fail =>' + err);
        });
      }
    })
      .catch((error) => {
        console.log(error);
        res.send('Users.findOne catch =>' + error);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/reissue', authOnlyRefreshToken, (req, res) => {
  Users.findOne({
    where: { hashed_email: req.hashedEmail }
  }).then((user) => {
    if (user.refresh_token != req.headers.authorization) {
      res.status(400).json({
        code: 400,
        message: '전달된 Refresh토큰이 유저의 저장된 Refresh토큰과 다릅니다.',
      });
    }
    const accessToken = jwt.sign({
      type: 'ACCESS',
      hashed_email: req.hashedEmail
    }, process.env.JWT_SECRET, {
      expiresIn: '60m',
      issuer: '토큰발급자',
    });
    res.json({
      code: 200,
      message: '토큰이 재발급되었습니다.',
      accessToken
    });
  })
    .catch((error) => {
      console.log(error);
      res.send('User.findOne catch =>' + error);
    });
});

module.exports = router;
