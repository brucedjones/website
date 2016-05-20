var express = require('express');
var router = express.Router();

var async = require('async');

router.get('/resume', function(req, res) {

    res.locals.fixed_footer = false;
    
    collections = ["skills","work","education","activities"];

    var render = function(err) {
        if(err)
        {
            var error = {code:"500",description:"Internal server error, please contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a>"};
            res.locals.error = error;
            res.locals.fixed_footer = true;
            res.status(500).render('error');
        } else {
            res.render('resume');
        }
    };

    var getCollection = function(collection,callback){
        res.locals.db.collection(collection).find({}).toArray(function(err, docs) {
            if (err) {
                var error = {code:"500",description:"Internal server error, please contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a>"};
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