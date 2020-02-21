var express = require('express');
var router = express.Router();

var ttl = 60000;
var ttlRetries = 5;

var ttlData = require('../ttlData');
var software = new ttlData(ttl, ttlRetries);

router.get('/software', function (req, res) {

	var finalize = function (data) {
		res.locals.software = data;
		res.render('software');
	};

	var loadData = function (callback) {
		res.locals.db.collection("software").find({}).toArray(function (err, docs) {
			if (err) {
				callback();
			} else {
				callback(docs);
			}
		});
	};

	var error = function (callback) {
		res.locals.error = { code: "500", description: "<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bruce.david.jones@gmail.com'>bruce.david.jones@gmail.com</a></p>" };
		res.status(500).render('error');
	};

	software.doCached(loadData, finalize, error);

});

module.exports = router;