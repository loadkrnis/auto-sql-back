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
            res.send("userId:[" + req.params.userId + "] is not exist.");
        }
        else {
            Erd.findOne({
                where: {
                    user_idx: req.params.userId,
                    database_name: req.body.database_name
                }
            }).then((result) => {
                res.send(result);
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