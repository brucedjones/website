var express = require('express');
var router = express.Router();

var async = require('async');

router.get('/resume', function(req, res) {

    res.locals.fixed_footer = false;
    
    collections = ["skills","work","education","activities"];

    var render = function(err) {
        if(err)
        {
            res.status(500).send({error:"Failed to get data from database"});
        } else {
            res.render('resume');
        }
    };

    var getCollection = function(collection,callback){
        res.locals.db.collection(collection).find({}).toArray(function(err, docs) {
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