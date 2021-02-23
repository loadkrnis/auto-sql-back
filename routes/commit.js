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
    Erds.findOne({
        where: { user_id: req.hashedEmail, name: erdName }
    }).then((erd) => {
        if (erd == null) res.status(400).send({ error: "erdName:[" + req.params.erdName + "] is not exit in userId[" + req.hashedEmail + "]" });
        ErdCommits.create({
            erd_id: erd.id,
            data: req.body.data
        }).then((result) => {
            res.json({
                code: 200,
                result
            });
        });
    })
});

module.exports = router;