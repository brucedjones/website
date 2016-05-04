var express = require('express');
var router = express.Router();

var GitHubApi = require("github");

var github = new GitHubApi({
    // required 
    version: "3.0.0",
    // optional 
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "dr-bdjones" // GitHub is happy with a unique user agent 
    }
});

router.get('/software', function(req, res) {

    res.locals.fixed_footer = true;

    github.repos.get({
    	user: "brucedjones",
    	repo: "website"
	}, function(err, docs) {
		res.locals.software = JSON.stringify(docs);
		res.render('software');
	});
    
});

module.exports = router;