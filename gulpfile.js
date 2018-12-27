var autoprefixer = require('gulp-autoprefixer');
var debug = require('gulp-debug');
var del = require('del');
var fs = require('fs');
var fileinclude = require('gulp-file-include');
var ghPages = require('gh-pages');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var minifyInline = require('gulp-minify-inline');
var minifyHtml = require('gulp-htmlmin');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

// version css
var json = JSON.parse(fs.readFileSync('./package.json'));
var currentVersion = json.version;

// file locations
var src = 'src/';
var dist = 'dist/';

var htmlDir = src + 'html/**/*.html';
var sassDir = src +'styles/**/*.scss';
var sassSrc = src + 'styles/index.scss';
var jsDir = src + 'js/**/*.**';
var imgDir = src + 'images/**/*.+(png|jpg|gif|svg|mp4)';
var cnameSrc = src + 'html/CNAME';
var favIconSrc = src + 'html/favicon.png';
var robotsSrc = src + 'html/robots.txt';
var sitemapSrc = src + 'html/sitemap.xml';

var htmlDist = dist;
var sassDist = dist + 'styles/';
var jsDist = dist + 'js/';
var imgDist = dist + 'images/';

// delete dist
gulp.task('clean', function() {
  return del.sync('dist');
});

// include files
gulp.task('html', function() {
  return gulp.src(htmlDir)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: src
    }))
    .pipe(gulp.dest(htmlDist));
});

// sass
gulp.task('sass', function() {
  return gulp.src(sassSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      remove: false
    }))
    .pipe(rename({
      suffix: '-' + currentVersion
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(sassDist));
});

gulp.task('sass:build', function() {
  return gulp.src(sassSrc)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(sassDist))
    .pipe(rename({
      suffix: '-' + currentVersion
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(sassDist));
});

// inject css tag
gulp.task('inject', function () {
  return gulp.src(htmlDist + '**/index.html')
    .pipe(inject(gulp.src(sassDist + 'index-' + currentVersion + '.css', {read: false}), {
      removeTags: true,
      transform: function () {
        return '<link rel="stylesheet" href="' + '/styles/index-' + currentVersion + '.css">';
      }
    }))
    .pipe(gulp.dest(htmlDist));
});

// javascript
gulp.task('js', function () {
  return gulp.src(jsDir)
    .pipe(newer(jsDist))
    .pipe(debug({
      title: 'js'
    }))
    .pipe(gulp.dest(jsDist));
});

// minifier
gulp.task('minify', function() {
  gulp.src(dist + '**/*.html')
    .pipe(minifyInline({
      jsSelector: 'script[ugly]'
    }))
     .pipe(minifyHtml({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(dist));
});

// images
gulp.task('images', function () {
  return gulp.src(imgDir)
    .pipe(newer(imgDist))
    .pipe(debug({
      title: 'images'
    }))
    .pipe(gulp.dest(imgDist));
});

// robots, sitemap, and favicon
gulp.task('moveMisc', function () {
  return gulp.src([cnameSrc, robotsSrc, sitemapSrc, favIconSrc])
    .pipe(debug({
      title: 'moveMisc'
    }))
    .pipe(gulp.dest(htmlDist));
});

// imagemin
gulp.task('imagemin', function() {
  return gulp.src(imgDist + '/**/*.+(png|jpg|gif)')
    .pipe(imagemin())
    .pipe(debug({
      title: 'imagemin'
    }))
    .pipe(gulp.dest(imgDist));
});

// deploy /dist to gh pages
gulp.task('ghPages', function() {
  ghPages.publish('dist', function(err) {});
});

// build and optimize
gulp.task('build', function(cb) {
  runSequence('clean', 'html', 'js', ['sass:build', 'images', 'moveMisc', 'minify'], ['inject', 'imagemin'], cb);
});

// build without optimizing
gulp.task('build:dev', function(cb) {
  runSequence('clean', 'html', 'js', ['sass', 'images', 'moveMisc'], 'inject', cb);
});

// build and deploy to gh pages
gulp.task('deploy', function(cb) {
  runSequence('build', 'ghPages', cb);
});

// local webserver
gulp.task('server', function() {
  gulp.src(dist)
    .pipe(webserver());
});

// dev build and watch
gulp.task('default', function(cb) {
  runSequence('build:dev', 'server', cb);
  gulp.watch(htmlDir, function(){runSequence('html', 'inject');});
  gulp.watch(sassDir, ['sass']);
  gulp.watch(jsDir, function(){runSequence('html', 'js', 'inject');});
  gulp.watch(imgDir, ['images']);
});
