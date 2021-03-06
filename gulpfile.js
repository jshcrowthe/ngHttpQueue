var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var closure = require('gulp-jsclosure');
var bower = require('gulp-bower');
var rename = require('gulp-rename');

var projectFiles = ['src/*'];

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

gulp.task('build', function() {
  return gulp.src(['./src/*.js'])
          .pipe(concat('ngHttpQueue.js'))
          .pipe(gulp.dest('./dist'));
});

gulp.task('minify', function() {
  return gulp.src('./dist/ngHttpQueue.js')
          .pipe(uglify())
          .pipe(rename(function(path) {
            path.extname = '.min' + path.extname;
          }))
          .pipe(gulp.dest('./dist'));
});


gulp.task('test-dev', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('test-run', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['build', 'minify', 'test-run'], function() {
  gulp.watch(projectFiles, ['build']);
  gulp.watch('./dist/ngHttpQueue.js', ['test-run']);
  gulp.watch('./dist/ngHttpQueue.js', ['minify']);
});