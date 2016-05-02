var express = require('express');
var router = express.Router();

router.get('/publications', function(req, res) {

    res.locals.db.collection("journal").find({}).toArray(function(err, docs) {
        if (err) {
            res.status(500).send({error:"Failed to get data from database"});
        } else {
            docs = docs.sort(function(a,b){
                return a.year<b.year;
            });
            res.locals.journal = docs;

            res.locals.db.collection("conference").find({}).toArray(function(err, docs) {
                if (err) {
                    res.status(500).send({error:"Failed to get data from database"});
                } else {
                    docs = docs.sort(function(a,b){
                        return a.year<b.year;
                    });
                    
                    res.locals.conference = docs;
                    res.render('publications');
                }
            });
        }
    });
});

module.exports = router;