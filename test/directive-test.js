// Tests for autoComplete directive
var reqHandler;
var $serviceProvider;
var $service;
var $backend;

beforeEach(module('ngCompleteProvider', function(ngCompleteServiceProvider) {
  $serviceProvider = ngCompleteServiceProvider;
}));

beforeEach(inject(function($httpBackend, ngCompleteService) {
  $backend   = $httpBackend;
  reqHandler = $backend.when('GET', '/test?q=non-array').respond({'test': 'requests'});
  reqHandler = $backend.when('GET', '/test?q=strings').respond(['test', 'requests']);
  reqHandler = $backend.when('GET', '/test?q=mixed').respond(['test', 'requests', {test:'val'}]);
  $service   = ngCompleteService;
}));

describe("ngComplete Provider Test Suite", function() {
  describe('Provider Defaults', function() {
    beforeEach(function() {
      $serviceProvider.setURL('/test?q=');
    });
    it('Should contain a default return obj parser', function() {
      expect(typeof $serviceProvider.getDataMapper()).to.equal('function');
    });
    it('Should return null for non-array elements', function(done) {
      $service.getSuggestions('non-array')
        .then(function(data) {
          expect(data).to.eql([]);
          done();
        });
      $backend.flush();
    });
    it('Should return all strings for array elements', function(done) {
      $service.getSuggestions('strings')
        .then(function(data) {
          expect(data).to.eql(['test', 'requests']);
          done();
        });
      $backend.flush();
    });
    it('Should nullify non-string array elements', function(done) {
      $service.getSuggestions('mixed')
        .then(function(data) {
          expect(data).to.eql(['test', 'requests']);
          done();
        });
      $backend.flush();
    });
  });
});