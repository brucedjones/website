var express = require('express');
var router = express.Router();

var async = require('async');

router.get('/publications', function(req, res) {

    res.locals.fixed_footer = true;

    collections = ["journal", "conference"];

    var render = function(err) {
        if(err)
        {
            res.status(500).send({error:"Failed to get data from database"});
        } else {
            res.render('publications');
        }
    };

    var getCollection = function(collection,callback){
        res.locals.db.collection(collection).find({}).sort({year:-1}).toArray(function(err, docs) {
            if (err) {
                res.status(500).send({error:"Failed to get data from " + collection});
                callback("Failed to get data from" + collection);
            } else {
                res.locals[collection] = docs;
                callback();
            }
        });
    };

    async.each(collections,getCollection,render);
});

module.exports = router;