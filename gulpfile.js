var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv;

if (argv.production) {
  sassStyle = 'compressed';
} else {
  sassStyle = 'expanded';
}

gulp.task('scripts', function() {
    return gulp.src('components/js/*.js')
        .pipe(concat('script.js'))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src('components/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: sassStyle}).on('error', sass.logError))
        .pipe(gulpif(argv.production, autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

gulp.task('imagemin', function () {
    gulp.src('build/images/*')
        .pipe(gulpif(argv.production, imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulpif(argv.production, gulp.dest('build/img-compressed')));
});

gulp.task('serve', function() {
    browserSync.init({
        open: 'external',
        host: 'gulp.dev',
        proxy: 'gulp.dev',
        port: 3000,
        notify: false
    });
});

gulp.task('watch', function() {
    gulp.watch('components/js/**/*.js', ['scripts']);
    gulp.watch('components/scss/**/*.scss', ['styles']);
    gulp.watch('build/**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['scripts', 'styles', 'imagemin', 'serve', 'watch']);