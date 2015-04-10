var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var compiler = require('gulp-hogan-compile');
// var browserify = require('gulp-uglify');

gulp.task('scripts', function() {
  gulp.src('./public/js/app.js')
    .pipe(browserify())
    .pipe(rename('bundle.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('templates', function() {
    gulp.src('./templates/**/*.mustache')
        .pipe(compiler('templates.js', {
          wrapper: 'commonjs',
          hoganModule: './lib/hogan'
        }))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('watch', function() {

  // Watch .js files
  gulp.watch('./public/js/**/*.js', ['scripts']);
  gulp.watch('./templates/**/*.mustache', ['templates']);

});
