var gulp = require('gulp'),
  gutil = require('gulp-util'),
  webserver = require('gulp-webserver'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat');

gulp.task('js', function() {
  gulp.src('builds/development/js/controllers/*')
});

gulp.task('controllers', function() {
  gulp.src('builds/development/js/controllers/*')
    .pipe(concat('controllers.js'))
    .pipe(gulp.dest('builds/development/js'));
});

gulp.task('directives', function() {
  gulp.src('builds/development/js/directives/*')
    .pipe(concat('directives.js'))
    .pipe(gulp.dest('builds/development/js'));
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
});

gulp.task('css', function() {
  gulp.src('builds/development/css/*.css')
});

gulp.task('sass', function() {
  gulp.src('builds/development/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('builds/development/css'));
});

gulp.task('watch', function() {
  gulp.watch('builds/development/js/**/*', ['js']);
  gulp.watch('builds/development/js/controllers/*', ['controllers']);
  gulp.watch('builds/development/js/directives/*', ['directives']);
  gulp.watch('builds/development/css/*.css', ['css']);
  gulp.watch('builds/development/sass/**/*', ['sass']);
  gulp.watch(['builds/development/*.html',
    'builds/development/views/*.html'], ['html']);
});

gulp.task('webserver', function() {
  gulp.src('builds/development/')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['watch', 'html', 'js', 'controllers', 'directives', 'css', 'sass', 'webserver']);
