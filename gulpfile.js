const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

gulp.task('js', function () {
  return gulp.src([
    'node_modules/moment/moment.js',
    'src/js/WxData.js',
    'src/js/main.js',
    'src/js/**/*.js'
  ])
      .pipe(concat('weatherscan.js'))
      .pipe(uglify())
      .pipe(gulp.dest('webroot/js'));
});

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('webroot/css'));
});

gulp.task('default', gulp.series('js', 'sass'));

gulp.task('watch', function () {
  gulp.watch('src/scss/*.scss', gulp.series('sass'));
  gulp.watch('src/js/*.js', gulp.series('js'));
});