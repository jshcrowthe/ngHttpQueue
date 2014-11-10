// Tests for autoComplete directive
var reqHandler;
var $serviceProvider;
var $service;
var $backend;

beforeEach(module('ngHttpQueue', function($httpQueueProvider) {
  $httpQueueProvider.setMax(2);
}));

beforeEach(inject(function($httpBackend, $httpQueue, $q) {
  $backend   = $httpBackend;
  reqHandler = $backend.whenGET('/').respond();
  $service   = $httpQueue;
}));

describe("ngHttpQueue Provider Test Suite", function() {
  describe('$httpQueue Default Channel', function() {
    it('Should handle a queue with no channels', function(done) {
      $service.$http({
        url: '/',
        method: 'GET'
      });

      expect($service.getActiveReqs('default')).to.equal(1);
      expect($service.getReqs('default').length).to.equal(0);
      
      $service.$http({
        url: '/',
        method: 'GET'
      });
      
      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getReqs('default').length).to.equal(0);
      
      $service.$http({
        url: '/',
        method: 'GET'
      });
      
      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getReqs('default').length).to.equal(1);
      
      $backend.flush(1);
      
      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getReqs('default').length).to.equal(0);
      
      $backend.flush();
      
      expect($service.getActiveReqs('default')).to.equal(0);
      expect($service.getReqs('default').length).to.equal(0);
      done();
    });
  });
  describe('$httpQueue Multiple Channels', function() {
    it('Should handle a queue with a default and a custom channel', function(done) {
      $service.$http({
        url: '/',
        method: 'GET'
      });
      
      expect($service.getActiveReqs('default')).to.equal(1);
      expect($service.getReqs('default').length).to.equal(0);
      
      $service.$http({
        url: '/',
        method: 'GET'
      }, 'channel1');
      
      expect($service.getActiveReqs('default')).to.equal(1);
      expect($service.getActiveReqs('channel1')).to.equal(1);
      expect($service.getReqs('default').length).to.equal(0);
      expect($service.getReqs('channel1').length).to.equal(0);
      
      $service.$http({
        url: '/',
        method: 'GET'
      });

      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getActiveReqs('channel1')).to.equal(1);
      expect($service.getReqs('default').length).to.equal(0);
      expect($service.getReqs('channel1').length).to.equal(0);

      $service.$http({
        url: '/',
        method: 'GET'
      }, 'channel1');

      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getActiveReqs('channel1')).to.equal(2);
      expect($service.getReqs('default').length).to.equal(0);
      expect($service.getReqs('channel1').length).to.equal(0);

      $service.$http({
        url: '/',
        method: 'GET'
      });
      
      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getActiveReqs('channel1')).to.equal(2);
      expect($service.getReqs('default').length).to.equal(1);
      expect($service.getReqs('channel1').length).to.equal(0);

      $backend.flush(1);

      expect($service.getActiveReqs('default')).to.equal(2);
      expect($service.getActiveReqs('channel1')).to.equal(2);
      expect($service.getReqs('default').length).to.equal(0);
      expect($service.getReqs('channel1').length).to.equal(0);

      $backend.flush();

      expect($service.getActiveReqs('default')).to.equal(0);
      expect($service.getActiveReqs('channel1')).to.equal(0);
      expect($service.getReqs('default').length).to.equal(0);
      expect($service.getReqs('channel1').length).to.equal(0);

      done();
    });
  });
});