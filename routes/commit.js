const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const { auth, authOnlyAccessToken } = require('./authMiddleware');

/*
[POST] /commit/:erdName
{
    "data":{ ..erdToJsonData.. }
}
*/
router.post('/:erdName', authOnlyAccessToken, (req, res) => {
    const erdName = req.params.erdName;
    let owner = req.body.owner_id;
    if(owner == "") {
        owner = req.hashedEmail;
    }
    Erds.findOne({
        where: { user_id: owner, name: erdName }
    }).then((erd) => {
        if (erd == null) res.status(400).send({ error: "erdName:[" + req.params.erdName + "] is not exit in userId[" + req.hashedEmail + "]" });
        ErdCommits.create({
            erd_id: erd.id,
            data: req.body.data,
            user_id:req.hashedEmail
        }).then((result) => {
            res.json({
                code: 200,
                result
            });
        }).catch(err => {
            console.log(err);
        })
    })
});

/*
[GET] /commit/:erdName
*/
router.get('/:erdName/:owner_id', authOnlyAccessToken, async (req, res) => {
    const erdName = req.params.erdName;
    let owner = req.params.owner_id;
    if(req.body.owner_id == "undefined") {
        owner = req.hashedEmail;
    }
    const erdId = await Erds.findOne({
        where: { user_id: owner, name: erdName }
    }).then((erd) => {
        if (erd == null) res.status(400).send({ error: "erdName:[" + req.params.erdName + "] is not exit in userId[" + req.hashedEmail + "]" });
        return erd.id;
    });
    ErdCommits.findAll({
        where: { erd_id: erdId, }
    }).then((commit) => {
        const result = commit.map((val) => { return { commitId: val.id,createdWho:val.user_id ,createdAt: val.created_at } });
        res.status(200).json({
            code: 200,
            result
        });
    })
});

module.exports = router;