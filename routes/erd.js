const express = require('express');
const router = express.Router();
const Users = require('../models').users;
const Erds = require('../models').erds;
const ErdCommits = require('../models').erd_commits;
const SharedErds = require('../models').shared_erds;
const SharedUsers = require('../models').shared_users;
const Shared = require('../models').shared;
const { authOnlyAccessToken } = require('../middlewares/authMiddleware');

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
      user_id: req.hashedEmail
    }).then(() => {
      res.json({
        code: 200,
        result: erd // ERDS테이블에 INSERT 된 결과
      });
    })
  });
});

// [GET] /erd/list
router.get('/list', authOnlyAccessToken, async (req, res) => {
  Users.findOne({
    where: { hashed_email: req.decoded.hashed_email }
  }).then(async (user) => {
    if (user == null) res.status(400).send({ error: "hashedEmail:[" + req.decoded.hashed_email + "] is not exits." });
    else {
      let result = await Erds.findAll({
        where: { user_id: req.decoded.hashed_email }
      }).then(async (erd) => {
        let result = erd.map((val) => { return { erdId: val.id, erdName: val.name } });
        return result;
      });
      let sharedIds = await SharedUsers.findAll({
        where: { user_id: req.decoded.hashed_email }
      }).then(userList => {
        if (userList == null) return null;
        let sharedIdResult = userList.map(value => value.shared_id);
        return sharedIdResult;
      });
      let erdIds = await Promise.all(
        sharedIds.map(async (shared_id) => {
          let erdId = await SharedErds.findOne({
            where: { shared_id: shared_id }
          }).then(erd => {
            return erd.erd_id;
          });
          return erdId;
        })
      );
      await Promise.all(
        erdIds.map(async (erdId) => {
          await Erds.findOne({
            where: { id: erdId }
          }).then(erd => {
            if (erd.user_id != req.decoded.hashed_email) {
              result.push({ erdId: erd.id, erdName: erd.name, shared: true, owner_id: erd.user_id });
            }
            else {

              result.map(erdInfo => {
                if (erdInfo.erdId == erd.id) {
                  erdInfo.shared = true;
                  erdInfo.owner = true;
                  erdInfo.owner_id = erd.user_id;
                }
              });
            }
          });
        })
      );
      res.json({
        code: 200,
        result
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
// 2021-06-07 1422I / chandaley12 / edit: ErdCommits.findOne, add: limit: 1
router.get('/:erdId/force', authOnlyAccessToken, (req, res) => {
  Erds.findOne({
    where: { id: req.params.erdId }
  }).then(async (erd) => {
    if (erd == null) return res.status(400).send({ error: "erd_id:[" + req.params.erdId + "] is not exits." });
    let result = await ErdCommits.findOne({
      attributes: ['id', 'erd_id', 'created_at'],
      where: { erd_id: req.params.erdId },
      order: [['created_at', 'DESC']],
      limit: 1,
    }).then(async (commit) => {
      let data = await ErdCommits.findOne({
        where: { id: commit.id }
      }).then(lastCommit => lastCommit.data);
      let result = {
        commitId: commit.id,
        erdData: data,
      }
      return result
    }).catch(err => {
      console.log(err);
    });
    res.json({
      code: 200,
      result
    });
  })
});

// [GET] /erd/:erdId/:commitId
router.get('/:erdId/:commitId', authOnlyAccessToken, (req, res) => {
  ErdCommits.findOne({
    where: { erd_id: req.params.erdId, id: req.params.commitId }
  }).then(erd => {
    res.json({
      code: 200,
      result: { commitId: erd.id, createdAt: erd.created_at, data: erd.data }
    });
  })
  // Erds.findOne({
  //     where: { id: req.params.erdId, user_id: req.hashedEmail }
  // }).then((erd) => {
  //     if (erd == null) res.status(400).send({ error: "erd_id:[" + req.params.erdId + "] is not exits." });
  //     ErdCommits.findAll({
  //         where: { erd_id: req.params.erdId, id: req.params.commitId }
  //     }).then((commit) => {
  //         const result = commit.map((val) => { return { commitId: val.id, createdAt: val.created_at, data: val.data } });
  //         res.json({
  //             code: 200,
  //             result
  //         });
  //     });
  // }).catch((err) => {
  //     console.error(err);
  //     res.status(400).json({
  //         code: 400,
  //         err
  //     });
  // });
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
