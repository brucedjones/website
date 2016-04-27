// DATA
var social = {social:[
{title: "LinkedIn", fa:"fa fa-linkedin", url:"https://www.linkedin.com/pub/bruce-jones/29/5b5/79a"},
{title: "Twitter", fa:"fa fa-twitter", url:"https://twitter.com/DrBruceJones"},
{title: "ResearchGate", fa:"ai ai-researchgate", url:"https://www.researchgate.net/profile/Bruce_Jones9"},
{title: "Google Scholar", fa:"ai ai-google-scholar", url:"https://scholar.google.com/citations?hl=en&user=DArWtW8AAAAJ"},
{title: "GitHub", fa:"fa fa-github", url:"https://github.com/brucedjones"},
{title: "Facebook", fa:"fa fa-facebook", url:"https://www.facebook.com/brucedjones"},
{title: "Docker", fa:"fa fa-docker", url:"https://hub.docker.com/u/brucedjones/"}
]};

// Constants
var PORT = 8080;

var express = require('express');
//var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongo:27017');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var qr = require('qr-image');

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
    req.db = db;
    next();
});

app.get('/', function(req, res) {
    res.render('home',social);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);