var express = require('express');
var router = express.Router();

router.get('/software', function(req, res) {

    res.locals.fixed_footer = false;

    res.locals.db.collection("software").find({}).toArray(function(err, docs) {
        if (err) {
            var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
			res.locals.error = error;
			res.locals.fixed_footer = true;
			res.status(500).render('error');
        } else {
            res.locals.software = docs;
            res.render('software');
        }
    });
    
});

module.exports = router;