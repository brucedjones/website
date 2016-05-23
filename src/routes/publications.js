var express = require('express');
var router = express.Router();

var async = require('async');

router.get('/publications', function(req, res) {

    res.locals.fixed_footer = true;

    collections = ["journal", "conference"];

    var render = function(err) {
        if(err)
        {
            var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
            res.locals.error = error;
            res.locals.fixed_footer = true;
            res.status(500).render('error');
        } else {
            res.render('publications');
        }
    };

    var getCollection = function(collection,callback){
        res.locals.db.collection(collection).find({}).sort({year:-1}).toArray(function(err, docs) {
            if (err) {
                var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
                res.locals.error = error;
                res.locals.fixed_footer = true;
                res.status(500).render('error');
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