/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browserSync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concats = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['copy-html', 'copy-images', 'styles', 'lint'], function() {
  gulp.watch('sass/**.*.scss', ['styles']);
  gulp.watch('js/**/*.js', ['lint']);
  gulp.watch('/index.html', ['copy-html']);

  browserSync.init({
    server: './dist'
  })
  console.log('Hello World, This is Kim!!')
});

gulp.task('dist', [
  'copy-html',
  'copy-images',
  'styles',
  'lint',
  'scripts-dist'
]);

gulp.task('scripts', function() {
  gulp.src('js/**/*.js')
    .pipe(babel())
    .pipe(concats('all.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function() {
  gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concats('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('lint', function () {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('copy-html', function()  {
  gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
  gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer( {
        browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('dist/.css'))
      .pipe(browserSync.stream());
});

gulp.task('tests', function() {
  gulp.src('tests/spec/extraSpec.js')
  .pipe(jasmine(){
    integration: true;
    vendor: 'js/**/*.js'
  })
});
