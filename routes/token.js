const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models').users;
const Erd = require('../models').erd;
const router = express.Router();
const { auth } = require('./authMiddleware');
require('dotenv').config();

router.post('/:userHash', async (req, res) => {
    try {
      // 대충 DB에서 사용자 정보를 찾는 코드: 대충 id, nick 정보를 찾았다고 가정
      // API 키를 발급하여 사용하면 좋음(?)
      const id = 'myId';
      const nick = 'myNick';
  
      // jwt.sign() 메소드: 토큰 발급
      const token = jwt.sign({
        id,
        nick,
      }, process.env.JWT_SECRET, {
        expiresIn: '1m', // 1분
        issuer: '토큰발급자',
      });
  
      return res.json({
        code: 200,
        message: '토큰이 발급되었습니다.',
        token,
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
  
  // 발급된 토큰을 테스트하는 라우터
  router.get('/test', auth, (req, res) => {
    res.json(req.decoded);
  });
  
  module.exports = router;