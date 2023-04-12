const { src, dest, watch, series, parallel } = require('gulp');
const scss = require('gulp-sass')(require('sass')),
  concat = require('gulp-concat'),
  ugly = require('gulp-uglify-es').default,
  browserSync = require('browser-sync').create(),
  clean = require('gulp-clean'),
  htmlmin = require('gulp-htmlmin'),
  autoprefixer = require('gulp-autoprefixer');

function styles() {
  return src('src/styles/**/*.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('build/styles'))
    .pipe(dest('src/styles'))
    .pipe(browserSync.stream())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 8 versions'],
        browsers: ['Android >= 4', 'Chrome >= 22', 'Firefox >= 24', 'Explorer >= 11', 'iOS >= 6', 'Opera >= 11', 'Safari >= 6'],
      })
    );
}

function scripts() {
  return src('src/scripts/index.js')
    .pipe(concat('index.min.js'))
    .pipe(ugly())
    .pipe(dest('build/scripts'))
    .pipe(dest('src/scripts'))
    .pipe(browserSync.stream());
}

function html() {
  return src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('build'));
}

function watching() {
  watch(['src/styles/**/*.scss']).on('change', browserSync.reload) && styles;
  watch(['src/scripts/*.js']).on('change', browserSync.reload) && scripts;
  watch(['src/*.html']).on('change', browserSync.reload) && html;
}

function audioAndImages() {
  return (
    // src('./src/audio/audio.mp3').pipe(dest('build/audio/')) &&
    src('./src/img/*').pipe(dest('build/img/'))
  );
}

function otherFiles() {
  return src(['./robots.txt', './sitemap.xml']).pipe(dest('build'));
}

function browser() {
  browserSync.init({
    server: {
      baseDir: 'src/',
    },
  });
}

function cleanDist() {
  return src('build').pipe(clean());
}

function buildDist() {
  return src(['./src/index.html', './src/styles/style.min.css', './src/scripts/index.min.js'], { base: './src' }).pipe(dest('build'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.otherFiles = otherFiles;
exports.audioAndImages = audioAndImages;
exports.watching = watching;
exports.browser = browser;
exports.build = series(cleanDist, buildDist, styles, scripts, html, audioAndImages, otherFiles);
exports.default = parallel(styles, scripts, html, otherFiles, audioAndImages, watching, browser);
