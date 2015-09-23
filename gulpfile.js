var gulp = require('gulp'),
    jade = require('gulp-jade'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    lost = require('lost'),
    connect = require('gulp-connect');

gulp.task('jade', function() {
  return [
    gulp.src('./app/index.jade')
        .pipe(jade({
          pretty: true
        }))
        .pipe(gulp.dest('./build/')),
    gulp.src('./app/templates/**/*.jade')
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('./build/templates/')),

    gulp.src(['./app/index.jade','./app/templates/**/*.jade']).pipe(connect.reload())
  ];
});

gulp.task('sass', function() {

  var plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
    lost
  ];

  return [
    gulp.src('./app/styles/main.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/css/')),

    gulp.src('./app/styles/**/*').pipe(connect.reload())
  ];
});

gulp.task('babel', function() {
  return [
    gulp.src('./app/scripts/main.js')
      .pipe(babel())
      .pipe(gulp.dest('./build/js/')),

    gulp.src('./app/scripts/**/*').pipe(connect.reload())
  ];
});

gulp.task('connect', function() {
  connect.server({
    root: './build/',
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch(['./app/index.jade','./app/templates/**/*.jade'], ['jade']);
  gulp.watch('./app/styles/**/*', ['sass']);
  gulp.watch('./app/scripts/**/*', ['babel']);
});

gulp.task('compile', ['jade','sass','babel']);
gulp.task('default', ['compile','connect','watch']);