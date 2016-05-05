var express = require('express');
var router = express.Router();

router.get('/software', function(req, res) {

    res.locals.fixed_footer = true;

    res.locals.db.collection("software").find({}).toArray(function(err, docs) {
        if (err) {
            res.status(500).send({error:"Failed to get data from database"});
        } else {
            res.locals.software = docs;
            res.render('software');
        }
    });
    
});

module.exports = router;