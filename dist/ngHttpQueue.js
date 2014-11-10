(function() {
  'use strict';

  var _reqs = {};
  var _activeReqs = {};
  var _maxReqs = 5;

  var runReq = function(channel) {
    return function() {
      if (!_activeReqs[channel]) _activeReqs[channel] = 0;
      if (_activeReqs[channel] < _maxReqs && _reqs[channel].length > 0) {
        _activeReqs[channel]++;
        _reqs[channel].shift()();
      }
    };
  };

  angular.module('ngHttpQueue', [])
  .provider('$httpQueue', function() {
    
    this.setMax = function(val) {
      return (_maxReqs = val);
    };

    this.$get = ['$http', '$q', function($http, $q) {
      return {
        $http : function(config, channel) {
          if (!channel) channel = 'default';
          if (!_reqs[channel]) _reqs[channel] = [];
          var dfd = $q.defer();
          _reqs[channel].push(function() {
            $http(config).success(function(data) {
              _activeReqs[channel]--;
              return dfd.resolve(data); 
            }).error(dfd.reject).finally(runReq(channel));
          });
          runReq(channel)();

          return dfd.promise;
        },
        getReqs : function(channel) { 
          if (!channel) return _reqs; 
          return _reqs[channel];
        },
        getActiveReqs : function(channel) {
          if (!channel) return _activeReqs; 
          return _activeReqs[channel];
        },
      };
    }];
  });
})();