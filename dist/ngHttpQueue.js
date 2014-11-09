(function() {
  'use strict';

  var _reqs = [];
  var _defaultChannel = 'default';
  var _activeReqs = 0;
  var _maxReqs = 5;

  var runReq = function() {
    if (_activeReqs < _maxReqs && _reqs.length > 0) {
      _activeReqs++;
      _reqs.shift()();
    }
  };

  angular.module('ngHttpQueue', [])
  .provider('$httpQueue', function() {
    
    this.setMax = function(val) {
      return (_maxReqs = val);
    };

    this.$get = ['$http', '$q', function($http, $q) {
      return {
        $http : function(config, channel) {
          var dfd = $q.defer();

          _reqs.push(function() {
            $http(config).success(function(data) {
              _activeReqs--;
              return dfd.resolve(data); 
            }).error(dfd.reject).finally(runReq);
          });
          runReq();

          return dfd.promise;
        }
      };
    }];
  });
})();