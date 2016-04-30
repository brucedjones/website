var express = require('express');
var router = express.Router();

router.get('/resume', function(req, res) {
	res.locals.db.collection("skills").find({}).toArray(function(err, docs) {
    	if (err) {
    	  	res.status(500).send({error:"Failed to get data from database"});
    	} else {
    		res.locals.skills = docs;

    		res.locals.db.collection("work").find({}).toArray(function(err, docs) {
    			if (err) {
    	  			res.status(500).send({error:"Failed to get data from database"});
    			} else {
    				res.locals.work = docs;

					res.locals.db.collection("education").find({}).toArray(function(err, docs) {
    					if (err) {
    	  					res.status(500).send({error:"Failed to get data from database"});
    					} else {
    						res.locals.education = docs;

							res.locals.db.collection("activities").find({}).toArray(function(err, docs) {
    							if (err) {
    	  							res.status(500).send({error:"Failed to get data from database"});
    							} else {
    								res.locals.activities = docs;
									res.render('resume');
    							}
  							});
    					}
  					});
    			}
  			});
    	}
  	});
});

module.exports = router;