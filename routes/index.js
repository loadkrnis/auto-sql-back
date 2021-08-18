const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const SharedErds = require('../models').shared_erds;
const SharedUsers = require('../models').shared_users;

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('invite/:email/:userId/:sharedId', function (req, res) {
  const userId = req.params.userId;
  const sharedId = req.params.sharedId;
  SharedUsers.create({
    user_id: userId,
    shared_id: sharedId
  }).then(() => {
    res.redirect('https://autosql.co.kr');
  });
  // res.json({ email: email, userId: userId, sharedId: sharedId });
});

router.get('/landing/user', async function (req, res) {
  const count = await Users.count({ attributes: ['hashed_email'] });
  res.json({ count });
});

router.get('/landing/erd', async function (req, res) {
  const count = await Erds.count({ attributes: ['id'] });
  res.json({ count });
});

router.get('/landing/share', async function (req, res) {
  const count = await SharedErds.count({ attributes: ['id'] });
  res.json({ count });
});


module.exports = router;
