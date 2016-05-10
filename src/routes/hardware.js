var express = require('express');
var router = express.Router();

var http = require('http');

var projects = [];

var options = {
  host: 'picasaweb.google.com',
  path: '/data/feed/api/user/102348159258081608276/albumid/6282044543433796881?alt=json'
};

http.request(options, function(response) {
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

    projects.push({title:title,photos:photos});
    projects.push({title:title,photos:photos});
    projects.push({title:title,photos:photos});
    projects.push({title:title,photos:photos});
    projects.push({title:title,photos:photos});
    projects.push({title:title,photos:photos});
  });
}).end();

router.get('/hardware', function(req, res) {
	res.locals.projects = projects;
	res.render('hardware');
});

module.exports = router;