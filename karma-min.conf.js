// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-07-24 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/jquery-ui/jquery-ui.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-*/*.js',
      './dist/ngComplete.min.js',
      './test/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      'bower_components/**/*.min.*'
    ],

    // web server port
    port: 8080,

    browsers: [
    'PhantomJS'
    ],

    singleRun: false,

    reporters: ['mocha'],

    colors: true,

    logLevel: config.LOG_INFO,
  });
};
