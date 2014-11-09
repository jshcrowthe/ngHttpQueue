(function() {
  'use strict';
  angular.module('ngCompleteProvider', [])
  .provider('ngCompleteService', function() {
    var _url;

    var _responseParser;
    var _dataMapper;

    /**
     * SETTER: allows config of _url in the angular.module().config
     * @param {[string]} url This is the URL of the api that you will call
     * up to the query string. So for example 'https://api.github.com/search/repositories?q='
     * the value of your query will be placed at the end of the string
     */
    this.setURL = function(url) {
      _url = url;
    };

    /**
     * SETTER: allows you to conifig the _responseParser that is run if the response isn't
     * an array. So for example if I call the above Github api I get an object response. I need
     * to get the property items from the response. Therefore in my angular.module().config I will
     * put in the following function:
     *
     * ngCompleter.setResponseParser(function(response) {
     *   return response.items;
     * });
     * 
     * @param {[function]} fxn The function that will be called on the response to the api if it is
     * not an array
     */
    this.setResponseParser = function(fxn) {
      _responseParser = fxn;
    };

    /**
     * This is the map function that will be called on the response before filtering it for non-null values
     * @param {[function]} fxn The function that the array will be mapped through 
     */
    this.setDataMapper = function(fxn) {
      _dataMapper = fxn;
    };
    
    this.getDataMapper = function() {
      return _dataMapper;
    };

    var notNull = function(val) {
      return !!val;
    };

    var getObjectProp = function(val) {
      if (typeof val === 'string') return val;
      return null;
    };

    _dataMapper = (typeof _dataMapper === 'function') ? _dataMapper : getObjectProp;

    this.$get = ['$http', '$q', function($http, $q) {
      return {
        getSuggestions : function(val) {
          var dfd = $q.defer();

          $http({
            url : _url + val,
            method : "GET",
            headers : {
              "Content-Type": "application/json"
            }
          })
          .success(function(res) {
            if (Array.isArray(res)) return dfd.resolve(res.map(_dataMapper).filter(notNull));
            if (typeof _responseParser === 'function') return dfd.resolve(_responseParser(res).map(_dataMapper).filter(notNull));
            return dfd.resolve([]);
          })
          .error(dfd.reject);
          return dfd.promise;
        }
      };
    }];
  });
})();
/* global angular, FS */
angular
.module('ngComplete', ['ngCompleteProvider'])
.directive('ngComplete', ['ngCompleteService', function($service) {
  /**
   * Auto Complete Directive. This directive is to be put on an input tag and will 
   * utilize the provided url to generate an autocomplete. This function also takes an optional 
   * onselect function as an attribute.If this is provided the function mustcontain an attribute 
   * named value that will be filled with the value of the select (for more information see: 
   * http://blog-it.hypoport.de/2013/11/06/passing-functions-to-angularjs-directives/)
   * 
   * @param  {[object]} scope
   * @param  {[object]} element
   * @return {[object]}
   */
  function autoCompleteLink(scope, element) {
    element.autocomplete({
      source : function(req, res) {
        return $service.getSuggestions(scope.value).then(res, res);
      },
      select : function(event, ui) {
        scope.value = ui.item.value;
        if (typeof scope.onselect === 'function') scope.onselect({value:ui.item.value});
        return ui.item.value;
      },
      minLength: 2
    });
  }
  return {
    restrict: 'A',
    scope: {
      value: '=ngModel',
      onselect: '&'
    },
    replace: false,
    require: 'ngModel',
    link:autoCompleteLink,
  };
}]);