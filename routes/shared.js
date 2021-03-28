const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const { auth, authOnlyAccessToken } = require('./authMiddleware');

router.get('/', authOnlyAccessToken, async (req, res) => {
    res.json({ code: 200, result: "Hello World!" });
});


module.exports = router;