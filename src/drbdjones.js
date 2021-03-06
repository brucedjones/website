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

// Make our db accessible to our router and load social data
var ttl = 60000;
var ttlRetries = 5;
var ttlData = require('./ttlData');
var social = new ttlData(ttl, ttlRetries);

app.use(function (req, res, next) {

  res.locals.db = db;
  res.locals.fixed_footer = false;

  var finalize = function (data) {
    res.locals.social = data;
    next();
  };

  var loadData = function (callback) {
    db.collection("social").find({}).toArray(function (err, docs) {
      if (err) {
        callback();
      } else {
        callback(docs);
      }
    });
  };

  var error = function (callback) {
    res.status(500).send({ error: "Something went wrong, please contact bruce.david.jones@gmail.com" });
  };

  social.doCached(loadData, finalize, error);
});

var home = require('./routes/home');
app.use(home);

var resume = require('./routes/resume');
app.use(resume);

var publications = require('./routes/publications');
app.use(publications);

var software = require('./routes/software');
app.use(software);

var hardware = require('./routes/hardware');
app.use(hardware);

app.use(function (req, res, next) {
  var error = { code: "404", description: "Page not found" };
  res.locals.error = error;
  res.locals.fixed_footer = true;
  res.status(404).render('error');
});

console.error(process.env.MONGODB_URI)
// Connect to the database before starting the application server.
MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    console.log("Database connection failed");
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