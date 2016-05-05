var express = require('express');
var router = express.Router();

router.get('/software', function(req, res) {

    res.locals.fixed_footer = true;

    res.locals.software = [];
    res.locals.software.push({title:"This Website",
    	github:"website",
    	description:"This site served two purposes. <ul> <li>Finally set up a proper website for myself.</li> <li>A good oppurtunity to become more familiar with Express and Heroku.</li></ul>",
    	tags:["Node.js","Express","Heroku"]
    });

    res.locals.software.push({title:"This Website",
    	github:"website",
    	description:"This site served two purposes. <ul> <li>Finally set up a proper website for myself.</li> <li>A good oppurtunity to become more familiar with Express and Heroku.</li></ul>",
    	tags:["Node.js","Express","Heroku"]
    });

    res.locals.software.push({title:"This Website",
    	github:"website",
    	description:"This site served two purposes. <ul> <li>Finally set up a proper website for myself.</li> <li>A good oppurtunity to become more familiar with Express and Heroku.</li></ul>",
    	tags:["Node.js","Express","Heroku"]
    });

    res.locals.software.push({title:"This Website",
    	github:"website",
    	description:"This site served two purposes. <ul> <li>Finally set up a proper website for myself.</li> <li>A good oppurtunity to become more familiar with Express and Heroku.</li></ul>",
    	tags:["Node.js","Express","Heroku"]
    });

    res.render('software');
    
});

module.exports = router;