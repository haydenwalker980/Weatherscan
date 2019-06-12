const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('webroot/css'));
});

gulp.task('default', gulp.series('sass'));

gulp.task('watch', function () {
  gulp.watch('scss/*.scss', gulp.series('sass'));
});