const { src, dest, series, parallel } = require('gulp'),
  concat = require('gulp-concat'),
  ugly = require('gulp-uglify-es').default,
  clean = require('gulp-clean'),
  htmlmin = require('gulp-htmlmin'),
  autoprefixer = require('gulp-autoprefixer');

function styles() {
  return src('src/styles/global.css')
    .pipe(concat('style.min.css'))
    .pipe(dest('build/styles'))
    .pipe(dest('src/styles'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        browsers: ['Android >= 4', 'Chrome >= 22', 'Firefox >= 24', 'Explorer >= 11', 'iOS >= 6', 'Opera >= 11', 'Safari >= 6'],
      })
    );
}

function scripts() {
  return src('src/scripts/main.js').pipe(concat('main.min.js')).pipe(ugly()).pipe(dest('build/scripts')).pipe(dest('src/scripts'));
}

function html() {
  return src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('build'));
}

function images() {
  return src('./src/img/*').pipe(dest('build/img/'));
}

function otherFiles() {
  return src(['./src/manifest.json']).pipe(dest('build'));
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
exports.images = images;
exports.build = series(cleanDist, buildDist, styles, scripts, images, html, otherFiles);
exports.default = parallel(styles, scripts, html, images, otherFiles);
