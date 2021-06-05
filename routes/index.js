const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const SharedErds = require('../models').shared_erds;
const SharedUsers = require('../models').shared_users;
const Shared = require('../models').shared;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('invite/:email/:userId/:sharedId', function (req, res, next) {
  const email = req.params.email;
  const userId = req.params.userId;
  const sharedId = req.params.sharedId;
  SharedUsers.create({
    user_id:userId,
    shared_id:sharedId
  }).then(result => {
    res.redirect('https://autosql.ga');
  })
  // res.json({ email: email, userId: userId, sharedId: sharedId });
});




module.exports = router;
