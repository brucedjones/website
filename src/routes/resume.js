var express = require('express');
var router = express.Router();

var async = require('async');

var ttl = 60000;
var ttlRetries = 5;

var ttlData = require('../ttlData');
var resume = new ttlData(ttl,ttlRetries);

router.get('/resume', function(req, res) {

    var finalize = function(data){
        res.locals.resume = data;
        res.render('resume');
    };

    var loadData = function(ttlCallback){

        collections = ["skills","work","education","activities"];

        resData = {};

        var render = function(err) {
            if(err)
            {
                ttlCallback();
            } else {
                ttlCallback(resData);
            }
        };

        var getCollection = function(collection,callback){
            res.locals.db.collection(collection).find({}).sort({year:-1}).toArray(function(err, docs) {
                if (err) {
                    callback("Failed to get data from" + collection);
                } else {
                    resData[collection] = docs;
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

    resume.doCached(loadData, finalize, error);
});

module.exports = router;