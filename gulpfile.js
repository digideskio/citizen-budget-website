var nunjucksRender = require('gulp-nunjucks-render'),
    browserSync    = require('browser-sync'),
    imagemin       = require('gulp-imagemin'),
    cache          = require('gulp-cache'),
    shell          = require('gulp-shell'),
    data           = require('gulp-data'),
    gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    del            = require('del');

// Clean Dist
gulp.task('clean', function() {
  return del.sync('public');
});

// Browser Sync
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'public'
    }
  });
});

// Sass
gulp.task('sass', function() {
  return gulp.src('source/sass/**/*.scss') // Gets all files ending with .scss in source/sass
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/en'))
    .pipe(gulp.dest('public/fr'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('vendor', function() {
  return gulp.src('source/static/vendor/**/*')
    .pipe(gulp.dest('public/en/vendor'))
    .pipe(gulp.dest('public/fr/vendor'));
});

gulp.task('image-dev', function() {
  return gulp.src('source/static/images/**/*')
    .pipe(gulp.dest('public/en/images'))
    .pipe(gulp.dest('public/fr/images'));
});

gulp.task('js-dev', function() {
  return gulp.src('source/static/*.js')
    .pipe(gulp.dest('public/en'))
    .pipe(gulp.dest('public/fr'));
});

// Nunjucks
gulp.task('nunjucks-en', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('source/templates/en/**/[^_]*.html')
    // Renders template with nunjucks
    .pipe(nunjucksRender({path: 'source/templates/en'}))
    // output files in app folder
    .pipe(gulp.dest('public/en'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('nunjucks-fr', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('source/templates/fr/**/[^_]*.html')
    // Renders template with nunjucks
    .pipe(nunjucksRender({path: ['source/templates/fr']}))
    // output files in app folder
    .pipe(gulp.dest('public/fr'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('deploy', shell.task([
  'git push cb-en master',
  'git push cb-fr master',
  'git push cb-en --delete gh-pages',
  'git push cb-fr --delete gh-pages',
  'git subtree push --prefix public/en cb-en gh-pages',
  'git subtree push --prefix public/fr cb-fr gh-pages'
]));

gulp.task('watch', ['browserSync', 'sass', 'nunjucks-en', 'nunjucks-fr', 'image-dev', 'vendor', 'js-dev'], function() {
  gulp.watch('source/sass/**/*.scss', ['sass']);
  gulp.watch('source/static/scripts.js', ['js-dev']);
  gulp.watch('source/templates/en/**/*.html', ['nunjucks-en']);
  gulp.watch('source/templates/fr/**/*.html', ['nunjucks-fr']);
  // Other watchers
});

gulp.task('default', ['watch']);
