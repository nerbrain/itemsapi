'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var gzip = require('compression');
var nconf = require('nconf');
var port = nconf.get('port');
var _ = require('underscore');
var router = express.Router();
var server;
var httpNotFound = 404;
var httpBadRequest = 400;


app.locals.environment = process.env.NODE_ENV || 'development'; // set env var
app.disable('etag');
app.disable('x-powered-by');
app.use(gzip({treshold: 512}));
app.use(bodyParser.json());
app.use('/api/item', router); // api routes


var configHelper = require('./src/helpers/config')(nconf.get());
var collectionsNames = configHelper.collectionsNames();

for (var i = 0 ; i < collectionsNames.length ; ++i) {
  var name = collectionsNames[i];

  /*
   * create specific item
   */
  router.post('/' + name, function postItem(req, res, next) {
    res.json({});
  });

  /*
   * get specific item
   */
  router.get('/' + name + '/:id', function getItem(req, res, next) {
    var id = req.params.id;

    if (!id) {
      return res.status(httpNotFound).json({});
    }
    res.json({});
  });

  /*
   * update specific item
   */
  router.put('/' + name + '/:id', function updateItem(req, res, next) {
    var id = req.params.id;

    if (!id) {
      return res.status(httpNotFound).json({});
    }
    res.json({});
  });

  /*
   * get items
   */
  router.get('/' + name + '/find', function getItems(req, res, next) {
    res.json({});
  });

  /*
   * get similar items
   */
  router.get('/' + name + '/:id/similar', function getSimilarItems(req, res, next) {
    var id = req.params.id;

    if (!id) {
      return res.status(httpNotFound).json({});
    }
    res.json({});
  });

  /*
   * item autocomplete
   */
  router.get('/' + name + '/autocomplete', function autocomplete(req, res, next) {
    res.json({});
  });

  /**
   * find nearest items to provided current gps
   */
  router.get('/' + name + '/near/:key/:gps', function autocomplete(req, res, next) {
    res.json({});
  });

}


app.use(function errorRoute(err, req, res, next) {
  res.status(httpBadRequest).json(err);
  next();
});


/**
 * start server
 */
exports.start = function start(done) {
  server = app.listen(port, function afterListen() {
    done(server);
  });
};


/**
 * stop server
 */
exports.stop = function start() {
  server.close();
};

exports.app = app;
