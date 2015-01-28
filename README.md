ngHttpQueue
===========
[![Build Status](https://travis-ci.org/jshcrowthe/ngHttpQueue.svg?branch=master)](https://travis-ci.org/jshcrowthe/ngHttpQueue)
A service to restrict the number of AJAX requests being fired at once as to not block the browser from making other requests.

This is a service that allows you to limit the amount of AJAX requests that you are making so as to not block the browser from making other requests (e.g. blocking navigation with angular-router). It is done by simply including the module ```ngHttpQueue```.

```javascript
angular.module('myApp', ['ngHttpQueue']);
```

After including the module you can include the ```$httpQueue``` service in your controller/directive/provider dependencies. 

```javascript
angular
.module('myApp', ['ngHttpQueue'])
.controller('myController', ['$httpQueue', function($httpQueue) {
  // Controller Code Here
}]);
```

The service provides you with a function ```$http()``` that takes the same config object that you would give to the standard $http service.

```javascript
angular
.module('myApp', ['ngHttpQueue'])
.controller('myController', ['$httpQueue', function($httpQueue) {
  $httpQueue.$http({
    url: '/api/route',
    method: 'GET'
  })
}]);
```

The service returns a standard $q promise so you can use the then, catch, and finally properties the response data is the first parameter supplied.