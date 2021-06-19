const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const Shared = require('../models').shared;
const SharedErds = require('../models').shared_erds;
const SharedUsers = require('../models').shared_users;
const axios = require('axios')
const { auth, authOnlyAccessToken } = require('./authMiddleware');

router.post('/:erdName', async (req, res) => {
    let userId = 'chandaley12';
    let erdId = req.body.erd_id;
    let sharedName = req.body.shared_name;
    let teamList = req.body.team_list; // ['asd@asd.com', 'dsa@dsa.com'] -> 만든사람 제외
    shared = await Shared.create({
        name: sharedName,
        user_id: userId
    }).then(result => result);
    sharedErd = await SharedErds.create({
        shared_id: shared.id,
        erd_id: erdId
    }).catch(err => {
        console.log(err);
    });
    sucessList = {};
    await teamList.forEach(async userEmail => {
        await axios.post('https://node.meum.me/verify/autosql/invite', {
            email: userEmail,
            shared_name: sharedName,
            shared_id: shared.id,
        }).then(async (res) => {
            if (res.status == 200) {
                sucessList[userEmail.split('@')[0]] = true;
                console.log(sucessList);
            }
            else {
                sucessList[userEmail.split('@')[0]] = false;
                console.log(sucessList);
            }
        });
    });

    res.json({ code: 200, result: sucessList });
});

router.get('/invite/:user_id/:shared_id', async (req, res) => {
    user_id = req.params.user_id;
    shared_id = req.params.shared_id;
    SharedUsers.create({
        user_id: user_id,
        shared_id: shared_id
    }).catch(err => {
        console.error(err);
        res.json(err);
    });
    res.redirect('https://erd.autosql.co.kr');
});
module.exports = router;