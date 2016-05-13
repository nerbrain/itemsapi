var should = require('should');
var sinon = require('sinon');
var assert = require('assert');
var setup = require('./../mocks/setup');

setup.makeSuite('add data service', function() {

  var dataService = require('./../../src/services/data');
  var searchService = require('./../../src/services/search');
  var projectService = require('./../../src/services/project');
  var elasticData = require('./../../src/elastic/data');

  beforeEach(function(done) {
    projectService.ensureCollectionAsync({
      projectName: 'test',
      collectionName: 'city'
    }).then(function(res) {
      done();
    });
  });

  it('should add document and be enabled', function(done) {
    var doc = {
      rating: 6,
      id: 5,
      name: 'Berlin'
    };

    dataService.addDocumentAsync({
      collectionName: 'city',
      refresh: true,
      body: doc,
    })
    .then(function(res) {
      done();
    });
  });

  it('should get document successfully', function(done) {
    dataService.getDocumentAsync({
      collectionName: 'city',
      id: 5
    }).then(function(res) {
      res.should.have.property('rating', 6);
      res.should.have.property('name', 'Berlin');
      res.should.have.property('id', 5);
      res.should.have.property('enabled', true);
      done();
    });
  });

  it('should disable item', function(done) {
    dataService.enableDocumentAsync({
      name: 'city',
      enabled: false,
      refresh: true,
      id: 5
    }).then(function(res) {
      res.should.have.property('_index', 'test');
      res.should.have.property('_type', 'city');
      res.should.have.property('_id', '5');
      dataService.getDocumentAsync({
        collectionName: 'city',
        id: 5
      }).then(function(res) {
        res.should.have.property('enabled', false);
        done();
      });
    });
  });

  it('should not find disabled items in search', function(done) {
    searchService.searchAsync({
      collectionName: 'city',
      per_page: 10,
      page: 1
    }).then(function(res) {
      res.data.items.should.lengthOf(0)
      //console.log(res);
      //console.log(res.data.items)
      done();
    });
  });

  it('should update item and keep last enabled value', function(done) {
    var doc = {
      rating: 5
    };
    dataService.updateDocumentAsync({
      collectionName: 'city',
      body: doc,
      id: 5
    }).then(function(res) {
      dataService.getDocumentAsync({
        collectionName: 'city',
        id: 5
      }).then(function(res) {
        res.should.have.property('enabled', false);
        res.should.have.property('rating', 5);
        done();
      });
    });
  });

  it('should update item and override enabled value', function(done) {
    var doc = {
      rating: 5,
      enabled: true
    };
    dataService.updateDocumentAsync({
      collectionName: 'city',
      body: doc,
      refresh: true,
      id: 5
    }).then(function(res) {
      dataService.getDocumentAsync({
        collectionName: 'city',
        id: 5
      }).then(function(res) {
        res.should.have.property('enabled', true);
        res.should.have.property('rating', 5);
        done();
      });
    });
  });

  it('should find enabled items in search', function(done) {
    searchService.searchAsync({
      collectionName: 'city',
      per_page: 10,
      page: 1
    }).then(function(res) {
      res.data.items.should.lengthOf(1)
      done();
    });
  });




});
