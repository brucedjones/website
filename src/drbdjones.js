// Constants
var express = require('express');
//var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongo = require('mongodb');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoClient = mongo.MongoClient;
var Server = mongo.Server;

// DB
var db;

// App
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
	
	db.collection("social").find({}).toArray(function(err, docs) {
    	if (err) {
    	  	res.status(500).send({error:"Failed to get data from database"});
    	} else {
    		res.locals.db = db;
    		res.locals.social = docs;
    		next();
    	}
  	});
});

var home = require('./routes/home');
app.use(home);

var resume = require('./routes/resume');
app.use(resume);

// Connect to the database before starting the application server.
MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

module.exports = app;