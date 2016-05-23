var express = require('express');
var router = express.Router();

var http = require('http');
var async = require('async');

router.get('/hardware', function(req, res) {

    res.locals.fixed_footer = false;

    res.locals.db.collection("hardware").find({}).toArray(function(err, docs) {
        if (err) {
            var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
			res.locals.error = error;
			res.locals.fixed_footer = true;
			res.status(500).render('error');
        } else {
        	hardware = [];

        	var render = function(err) {
        		if(err)
        		{
        		    var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
					res.locals.error = error;
					res.locals.fixed_footer = true;
					res.status(500).render('error');
        		} else {
        			res.locals.hardware = hardware;
            		res.render('hardware');
        		}
    		};

    		var getAlbum = function(album,callback){
    			url = "http://picasaweb.google.com/data/feed/api/user/102348159258081608276/albumid/" + album.picasa + "?alt=json";
    			var req = http.request(url, function(response) {
					var str = '';

					  //another chunk of data has been recieved, so append it to `str`
					response.on('data', function (chunk) {
					  str += chunk;
					});

					  //the whole response has been recieved, so we just print it out here
					response.on('end', function () {
						try {
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

					    	hardware.push({id:album.title,title:title,photos:photos});

					  		callback();
					  	} catch (err) {
					  		console.log("Could not parse HTML request for project " + album.title);
					  		callback("Could not parse HTML request for project " + album.title);}
					});
				});

				req.on('error', function(err){callback('Error getting data via http for ' + album.title);});

				req.end();
		    };

		    async.each(docs,getAlbum,render);
        }
    });
});

router.get('/hardware/:title', function(req , res){

    res.locals.fixed_footer = false;

    res.locals.db.collection("hardware").find({title:req.params.title}).toArray(function(err, docs) {
        if (err || docs.length<1) {
            var error = {code:"404",description:"Page not found"};
			res.locals.error = error;
			res.locals.fixed_footer = true;
			res.status(404).render('error');
        } else {
        	album_id = docs[0].picasa;
   			url = "http://picasaweb.google.com/data/feed/api/user/102348159258081608276/albumid/" + album_id + "?alt=json";
   			var req = http.request(url, function(response) {
				var str = '';

					  //another chunk of data has been recieved, so append it to `str`
				response.on('data', function (chunk) {
				  str += chunk;
				});

				  //the whole response has been recieved, so we just print it out here
				response.on('end', function () {
					try{
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

				  		res.locals.project = {id:docs[0].title,title:title,photos:photos, description:docs[0].description};
						res.render('hardware_project');
					} catch (e) {
						console.log("Could not parse HTML request for project " + docs[0].title);
					  	var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
						res.locals.error = error;
						res.locals.fixed_footer = true;
						res.status(500).render('error');
					}
				});
			});

			req.on('error', function(err){
				var error = {code:"500",description:"<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bdjones@mit.edu'>bdjones@mit.edu</a></p>"};
				res.locals.error = error;
				res.locals.fixed_footer = true;
				res.status(500).render('error');
				console.log('Error getting data via http for ' + docs[0].title);
			});

			req.end();
        }
    });
});

module.exports = router;