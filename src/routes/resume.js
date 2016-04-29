var express = require('express');
var router = express.Router();

router.get('/resume', function(req, res) {
	res.render('resume');
});

module.exports = router;