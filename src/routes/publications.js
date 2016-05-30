var express = require('express');
var router = express.Router();

var async = require('async');

var ttl = 60000;
var ttlRetries = 5;

var ttlData = require('../ttlData');
var publications = new ttlData(ttl,ttlRetries);

router.get('/publications', function(req, res) {

    var finalize = function(data){
        res.locals.publications = data;
        res.render('publications');
    };

    var loadData = function(ttlCallback){

        collections = ["journal", "conference"];

        pubData = {};

        var render = function(err) {
            if(err)
            {
                ttlCallback();
            } else {
                ttlCallback(pubData);
            }
        };

        var getCollection = function(collection,callback){
            res.locals.db.collection(collection).find({}).sort({year:-1}).toArray(function(err, docs) {
                if (err) {
                    callback("Failed to get data from" + collection);
                } else {
                    pubData[collection] = docs;
                    callback();
                }
            });
        };

        async.each(collections,getCollection,render);
    };

    var error = function(callback){
        res.locals.error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
        res.status(500).render('error');
    };

    publications.doCached(loadData, finalize, error);
});

module.exports = router;