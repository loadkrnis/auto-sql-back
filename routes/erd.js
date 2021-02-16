var express = require('express');
var router = express.Router();
var Users = require('../models').users;
var Erd = require('../models').erd;
/* GET users listing. */
router.post('/save/:userId', function (req, res, next) {
    Users.findOne({
        where: {
            idx: req.params.userId
        },
    }).then((result) => {
        if (result == null) {
            console.error("userId:[" + req.params.userId + "] is not exist.");
            res.send("userId:[" + req.params.userId + "] is not exist.");
        }
        else {
            Erd.findOne({
                where: {
                    user_idx: req.params.userId,
                    database_name: req.body.databaseName
                }
            }).then((result) => {
                if (result == null) {
                    console.error("databaseName:[" + req.body.databaseName + "] is not exist in userId:[" + req.params.userId + "]");
                    res.send("databaseName:[" + req.body.databaseName + "] is not exist in userId:[" + req.params.userId + "]");
                }
                Erd.update({ erd_json: req.body.erdJson },
                    {
                        where: { user_idx: req.params.userId, database_name: req.body.databaseName }
                    })
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.error("erd/save/:userId update fail " + err);
                        res.send("erd/save/:userId update fail " + err);
                    });
            }).catch((err) => {
                console.error(err);
                res.json(err);
            })
        }
    })
        .catch((err) => {
            console.error(err);
            res.json(err);
        });
});
module.exports = router;