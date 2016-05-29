var express = require('express');
var router = express.Router();

var ttl = 60000;
var ttlRetries = 5;

var ttlData = require('../ttlData');
var software = new ttlData(ttl,ttlRetries);

router.get('/software', function(req, res) {

    res.locals.fixed_footer = false;

    var finalize = function(data){
		res.locals.software = data;
        res.render('software');
	};

	var loadData = function(callback){
		res.locals.db.collection("software").find({}).toArray(function(err, docs) {
    		if (err) {
    		  	callback();
    		} else {
    			callback(docs);
    		}
  		});
	};

	var error = function(callback){
		var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
		res.locals.error = error;
		res.locals.fixed_footer = true;
		res.status(500).render('error');
	};

	software.doCached(loadData, finalize, error);
    
});

module.exports = router;