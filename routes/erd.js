const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erd = require('../models').erd;
const { auth } = require('./authMiddleware');

router.post('/get/:databaseName', auth, (req, res) => {
    let databaseName = req.params.databaseName;
    let userIdx = req.decoded.userIdx;
    Erd.findOne({
        where: { user_idx: userIdx, database_name: databaseName }
    }).then((result) => {
        if (result == null) {
            console.error("databaseName:[" + databaseName + "] is not exist in userId:[" + userIdx + "].");
            res.send("databaseName:[" + databaseName + "] is not exist in userId:[" + userIdx + "].");
        }
        res.json(result);
    })
});

router.post('/save/:databaseName', auth, (req, res, next) => {
    let userIdx = req.decoded.userIdx;
    Users.findOne({
        where: {
            idx: userIdx
        },
    }).then((result) => {
        if (result == null) {
            console.error("userIdx:[" + userIdx + "] is not exist.");
            res.send("userIdx:[" + userIdx + "] is not exist.");
        }
        Erd.findOne({
            where: {
                user_idx: userIdx,
                database_name: req.params.databaseName
            }
        }).then((result) => {
            if (result == null) {
                console.error("databaseName:[" + req.params.databaseName + "] is not exist in userId:[" + userIdx + "]");
                res.send("databaseName:[" + req.params.databaseName + "] is not exist in userId:[" + userIdx + "]");
            }
            Erd.update({ erd_json: req.body.erdJson },
                {
                    where: { user_idx: userIdx, database_name: req.params.databaseName }
                })
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    console.error("erd/save/:databaseName update fail " + err);
                    res.send("erd/save/:databaseName update fail " + err);
                });
        }).catch((err) => {
            console.error(err);
            res.json(err);
        })
    })
        .catch((err) => {
            console.error(err);
            res.json(err);
        });
});

router.post('/create/:userId', function (req, res, next) {
    Erd.create({
        user_idx: req.params.userId,
        erd_json: {},
        database_name: req.body.databaseName
    }).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.error(err);
        res.send(err);
    })
});
module.exports = router;