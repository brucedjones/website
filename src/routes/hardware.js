var express = require('express');
var router = express.Router();

var http = require('http');
var async = require('async');

router.get('/hardware', function(req, res) {

    res.locals.fixed_footer = true;

    res.locals.db.collection("hardware").find({}).toArray(function(err, docs) {
        if (err) {
            res.status(500).send({error:"Failed to get data from database"});
        } else {
        	hardware = [];

        	var render = function(err) {
        		if(err)
        		{
        		    res.status(500).send({error:"Failed to get data from database"});
        		} else {
        			res.locals.hardware = hardware;
            		res.render('hardware');
        		}
    		};

    		var getAlbum = function(album,callback){
    			url = "http://picasaweb.google.com/data/feed/api/user/102348159258081608276/albumid/" + album.picasa + "?alt=json";
    			http.request(url, function(response) {
					var str = '';

					  //another chunk of data has been recieved, so append it to `str`
					response.on('data', function (chunk) {
					  str += chunk;
					});

					  //the whole response has been recieved, so we just print it out here
					response.on('end', function () {
						album_data = JSON.parse(str);
					  	title = album_data.feed.title.$t;

					  	photos = [];
					  	album_data.feed.entry.forEach(function(photo){
					  		url = photo.media$group.media$content[0].url;
					  		fname = url.substring(url.lastIndexOf('/')+1);
					  		url = url.substring(0,url.lastIndexOf('/')+1);
					  		description = photo.media$group.media$description.$t;
					  		photos.push({url:url,fname:fname,description:description});
					  	});

					    hardware.push({title:title,photos:photos});

					  	callback();
					});
				}).end();
		    };

		    async.each(docs,getAlbum,render);
        }
    });
});

module.exports = router;