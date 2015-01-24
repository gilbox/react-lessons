var gulp            = require('gulp'),
    browserify      = require('browserify'),
    watchify        = require('watchify'),
    source          = require('vinyl-source-stream'),
    sourcemaps      = require('gulp-sourcemaps'),
    buffer          = require('vinyl-buffer'),
    to5ify          = require('6to5ify'),
    util            = require('gulp-util'),
    browserSync     = require('browser-sync'),
    fs              = require('fs'),
    path            = require('path');

var onError = function(err) {
  util.beep();
  util.log(err);
};

function makeWatchify(subdir) {
  gulp.task('watchify'+subdir, function() {
    var bundler = watchify(browserify({
      entries: './'+subdir+'/app.js',
      debug: true
    }), watchify.args);

    bundler.transform(to5ify);
    bundler.on('update', rebundle);

    function rebundle() {
      console.log("rebundle", subdir);
      return bundler.bundle()
        .on('error', util.log.bind(util, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe(browserSync.reload({stream:true}));
    }

    return rebundle();
  });

  gulp.task('watch-'+subdir, ['watchify'+subdir], sync)

  return 'watchify'+subdir;
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory() && ! file.match(/\.idea|node_modules|public|\.git/);
  });
}

function sync() {
  return browserSync.init(['./public/*.html','./public/*.css'],{
    notify:true,
    port: 4444,
    open:false,
    server: {
      baseDir: './'
    },
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: true
    }
  });
}

gulp.task('browser-sync', [], sync);

gulp.task('watch', getDirectories('./').map(function(d) { return makeWatchify(d) }), sync );

gulp.task('default', [], function () {
  console.log('Usage: gulp watch-[dir]');
  console.log("  gulp watch");
  console.log("  gulp browser-sync");
  getDirectories('./').forEach(function (d) {
    console.log("  gulp watch-" + d);
  })
});