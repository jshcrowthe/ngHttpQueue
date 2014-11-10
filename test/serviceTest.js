// Tests for autoComplete directive
var reqHandler;
var $serviceProvider;
var $service;
var $backend;

beforeEach(module('ngHttpQueue', function($httpQueueProvider) {
  $serviceProvider = $httpQueueProvider;
}));

beforeEach(inject(function($httpBackend, $httpQueue) {
  $backend   = $httpBackend;
  reqHandler = $backend.when('GET', '/').respond(200);
  $service   = $httpQueue;
}));

describe("ngComplete Provider Test Suite", function() {
  describe('Provider Defaults', function() {
    it('Should return null for non-array elements', function(done) {
      $backend.flush();
    });
  });
});