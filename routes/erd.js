const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const SharedErds = require('../models').shared_erds;
const SharedUsers = require('../models').shared_users;
const Shared = require('../models').shared;
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

// [GET] /erd/list
router.get('/list', authOnlyAccessToken, (req, res) => {
    Users.findOne({
        where: { hashed_email: req.decoded.hashed_email }
    }).then((user) => {
        if (user == null) res.status(400).send({ error: "hashedEmail:[" + req.decoded.hashed_email + "] is not exits." });
        else {
            Erds.findAll({
                where: { user_id: req.decoded.hashed_email }
            }).then((erd) => {
                const result = erd.map((val) => { return { erdId: val.id, erdName: val.name } });
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

// [GET] /erd/:erdId/force
router.get('/:erdId/force', authOnlyAccessToken, (req, res) => {
    Erds.findOne({
        where: { id: req.params.erdId, user_id: req.hashedEmail }
    }).then((erd) => {
        if (erd == null) res.status(400).send({ error: "erd_id:[" + req.params.erdId + "] is not exits." });
        ErdCommits.findAll({
            where: { erd_id: req.params.erdId },
            order: [['created_at', 'DESC']]
        }).then((commit) => {
            const result = commit.map((val) => { return { erdId: val.erd_id, createdAt: val.createAt, data: val.data } });
            res.json({
                code: 200,
                result
            });
        });
    }).catch((err) => {
        console.error(err);
        res.status(400).json({
            code: 400,
            err
        });
    });
});

// [GET] /erd/:erdId/:commitId
router.get('/:erdId/:commitId', authOnlyAccessToken, (req, res) => {
    Erds.findOne({
        where: { id: req.params.erdId, user_id: req.hashedEmail }
    }).then((erd) => {
        if (erd == null) res.status(400).send({ error: "erd_id:[" + req.params.erdId + "] is not exits." });
        ErdCommits.findAll({
            where: { erd_id: req.params.erdId, id: req.params.commitId }
        }).then((commit) => {
            const result = commit.map((val) => { return { commitId: val.id, createdAt: val.created_at, data: val.data } });
            res.json({
                code: 200,
                result
            });
        });
    }).catch((err) => {
        console.error(err);
        res.status(400).json({
            code: 400,
            err
        });
    });
});

// [DELETE] /erd/:erdId
router.delete('/:erdId', authOnlyAccessToken, async (req, res) => {
    const erdId = req.params.erdId;

    //공유된 ERD 삭제
    const sharedId = await SharedErds.findOne({
        where: { erd_id: erdId }
    }).then((sharedErd) => {
        if (sharedErd == null) return 0;
        return sharedErd.shared_id;
    });
    if (sharedId != 0) {
        await SharedUsers.destroy({ where: { shared_id: sharedId } });
        await SharedErds.destroy({ where: { erd_id: erdId } });
        await Shared.destroy({ where: { id: sharedId } });
    }

    //ERD, commit 삭제
    console.log(sharedId);
    await Erds.findOne({
        where: { id: erdId }
    }).then((erd) => {
        if (erd.user_id != req.hashedEmail) {
            res.status(400).json({
                code: 400,
                message: "토큰으로 보낸 hashedEmail과 Erd의 생성자가 일치하지 않습니다."
            });
        }
    });
    await ErdCommits.destroy({ where: { erd_id: erdId } });
    await Erds.destroy({ where: { id: erdId } });
    res.json({
        code: 200,
        message: "성공적으로 삭제되었습니다."
    });
});
module.exports = router;