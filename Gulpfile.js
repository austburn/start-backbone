var gulp, gutil, source, browserify, server, gutil, source,
  watchify, jscs, jshint, stylish, server;

gulp = require('gulp');
gutil = require('gutil');
source = require('vinyl-source-stream');
browserify = require('browserify');
watchify = require('watchify');
jscs = require('gulp-jscs');
jshint = require('gulp-jshint');
stylish = require('jshint-stylish');
server = require('pushstate-server');

gulp.task('default', ['lint']);

gulp.task('lint', ['jscs', 'jshint']);

gulp.task('jscs', function () {
  gulp.src('./app/**.*.js')
    .pipe(jscs());
});

gulp.task('jshint', function () {
  return gulp.src('./' /** insert src to lint */)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {
  var bundler = watchify(browserify('./app/init.js', watchify.args));

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./static'));
  }

  return rebundle();
});

gulp.task('serve', ['watch'], function () {
  server.start({
    port: 7111,
    directory: './static'
  });
});
