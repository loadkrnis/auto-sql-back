const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const { auth, authOnlyAccessToken } = require('./authMiddleware');

/*
[POST] /erd/
{
    "name":"erd_name",
}
emptyErd의 show를 수정하면 기본설정값 변경 가능
*/
router.post('/', authOnlyAccessToken, (req, res) => {
    const emptyErd = { "canvas": { "width": 2000, "height": 2000, "scrollTop": 0, "scrollLeft": 0, "show": { "tableComment": true, "columnComment": true, "columnDataType": true, "columnDefault": true, "columnAutoIncrement": false, "columnPrimaryKey": true, "columnUnique": false, "columnNotNull": true, "relationship": true }, "database": "MySQL", "databaseName": "", "canvasType": "ERD", "language": "GraphQL", "tableCase": "pascalCase", "columnCase": "camelCase", "setting": { "relationshipDataTypeSync": true, "columnOrder": ["columnName", "columnDataType", "columnNotNull", "columnUnique", "columnAutoIncrement", "columnDefault", "columnComment"] } }, "table": { "tables": [], "indexes": [] }, "memo": { "memos": [] }, "relationship": { "relationships": [] } }; //default ERD JSON
    const erdName = req.body.name;
    Erds.create({
        name: erdName,
        user_id: req.hashedEmail
    }).then((erd) => {
        ErdCommits.create({
            erd_id: erd.id,
            data: emptyErd,
        }).then(() => {
            res.json({
                code: 200,
                result: erd // ERDS테이블에 INSERT 된 결과
            });
        })
    });
});

// [GET] /erd/name-list
router.get('/name-list', authOnlyAccessToken, (req, res) => {
    Users.findOne({
        where: { hashed_email: req.decoded.hashed_email }
    }).then((user) => {
        if (user == null) res.status(400).send({ error: "hashedEmail:[" + req.decoded.hashed_email + "] is not exits." });
        else {
            Erds.findAll({
                where: { user_id: req.decoded.hashed_email }
            }).then((erd) => {
                const result = erd.map((val) => val.name);
                res.json({
                    code: 200,
                    result
                });
            });
        }
    }).catch((err) => {
        console.error(err);
        res.status(400).json({
            code: 400,
            err
        });
    });
});

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