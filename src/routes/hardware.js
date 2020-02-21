var express = require('express');
var router = express.Router();

var http = require('http');
var async = require('async');

var ttl = 60000;
var ttlRetries = 5;

var ttlData = require('../ttlData');
var hardware = new ttlData(ttl, ttlRetries);

var generatePhotoUrl = function (project, i) {
  return `/public/img/${project}/${i}.jpg`
}

var projectToViewData = function (project) {
  if (project.pictures) {
    photos = []
    for (var i = 0; i < project.pictures; i++) {
      photos.push(generatePhotoUrl(project.key, i))
    }
    return { ...project, photos }
  }
  return { ...project, photos: [] }
}

router.get('/hardware', function (req, res) {

  var finalize = function (data) {
    res.locals.hardware = data;
    res.render('hardware');
  };

  var loadData = function (ttlCallback) {
    res.locals.db.collection("hardware").find({}).toArray()
      .then((docs) => ttlCallback(docs.map(projectToViewData)))
      .catch(error)
  };

  var error = function (err) {
    console.error(err)
    res.locals.error = { code: "500", description: "<p>Something went wrong! Please try again in a few minutes.</p><p>If the problem persists please contact contact <a href='mailto:bruce.david.jones@gmail.com'>bruce.david.jones@gmail.com</a></p>" };
    res.status(500).render('error');
  };

  hardware.doCached(loadData, finalize, error);

});

hardware_projects = {};

router.get('/hardware/:title', function (req, res) {
  hardware_projects[req.params.title] = new ttlData(ttl, ttlRetries);
  var loadData = function (ttlCallback) {
    res.locals.db.collection("hardware").find({ key: req.params.title }).toArray()
      .then((docs) => {
        if (docs.length < 1) throw new Error('Project not found')
        return ttlCallback(projectToViewData(docs[0]))
      })
      .catch(error)
  }

  var finalize = function (data) {
    res.locals.project = data;
    res.render('hardware_project');
  };

  var error = (err) => {
    console.error(err)
    var error = { code: "404", description: "Page not found" };
    res.locals.error = error;
    res.locals.fixed_footer = true;
    res.status(404).render('error');
    return;
  }

  hardware_projects[req.params.title].doCached(loadData, finalize, error);
});

module.exports = router;