//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
sourceMaps  = require('gulp-sourcemaps');
imagemin    = require('gulp-imagemin');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');
plumber     = require('gulp-plumber');

gulp.task('browserSync', function(done) {
    browserSync({
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
    done();
});


//compressing images & handle SVG files
gulp.task('images', function(done) {
    gulp.src(['app/images/*.jpg', 'app/images/*.png'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('app/images'));
    done();
});

//compressing images & handle SVG files
gulp.task('images-deploy', function(done) {
    gulp.src(['app/images/**/*', '!app/images/README'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('docs/images'));
    done();
});

//compiling our Javascripts
gulp.task('scripts', function(done) {
    //this is where our dev JS scripts are
    gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
                //catch errors
                .on('error', gutil.log)
                //where we will store our finalized, compressed script
                .pipe(gulp.dest('app/scripts'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
    done();
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function(done) {
    //this is where our dev JS scripts are
    gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
                //compress :D
                .pipe(uglify())
                //where we will store our finalized, compressed script
                .pipe(gulp.dest('docs/scripts'));
    done();
});

//compiling our SCSS files
gulp.task('styles', function(done) {
    //the initializer / master SCSS file, which will just be a file that imports everything
    gulp.src('app/styles/scss/init.scss')
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber({
                  errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                  }
                }))
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'app/styles/scss/'
                      ]
                }))
                .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
                //catch errors
                .on('error', gutil.log)
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write())
                //where to save our final, compressed css file
                .pipe(gulp.dest('app/styles'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
    done();
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function(done) {
    //the initializer / master SCSS file, which will just be a file that imports everything
    gulp.src('app/styles/scss/init.scss')
                .pipe(plumber())
                //include SCSS includes folder
                .pipe(sass({
                      includePaths: [
                          'app/styles/scss',
                      ]
                }))
                .pipe(autoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                .pipe(minifyCSS())
                //where to save our final, compressed css file
                .pipe(gulp.dest('docs/styles'));
    done();
});

//basically just keeping an eye on all HTML files
gulp.task('html', function(done) {
    //watch any and all HTML files and refresh when something changes
    gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
    done();
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function(done) {
    //grab everything, which should include htaccess, robots, etc
    gulp.src('app/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('docs'));

    //grab any hidden files too
    gulp.src('app/.*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('docs'));

    gulp.src('app/fonts/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('docs/fonts'));

    //grab all of the styles
    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('docs/styles'));

    gulp.src('app/unitegallery/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('docs/unitegallery'));

    done();
});

//cleans our docs directory in case things got deleted
gulp.task('clean', function(done) {
    shell.task([
      'rm -rf docs'
    ]);
    done();
});

//create folders using shell
gulp.task('scaffold', function(done) {
  shell.task([
      'mkdir docs',
      'mkdir docs/fonts',
      'mkdir docs/images',
      'mkdir docs/scripts',
      'mkdir docs/styles'
    ]
  );
  done();
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
// GULP v3
// gulp.task('default', ['browserSync', 'scripts', 'styles'], function() {
//     //a list of watchers, so it will watch all of the following files waiting for changes
//     gulp.watch('app/scripts/src/**', ['scripts']);
//     gulp.watch('app/styles/scss/**', ['styles']);
//     gulp.watch('app/images/**', ['images']);
//     gulp.watch('app/*.html', ['html']);
// });
// GULP v4
gulp.task('default', gulp.series(gulp.parallel('browserSync', 'scripts', 'styles'), function (done) {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('app/scripts/src/**', gulp.series('scripts'));
    gulp.watch('app/styles/scss/**', gulp.series('styles'));
    gulp.watch('app/images/**', gulp.series('images'));
    gulp.watch('app/*.html', gulp.series('html'));
    done();
}));

//this is our deployment task, it will set everything for deployment-ready files
// GULP v3
// gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));
// GULP v4
gulp.task('deploy', gulp.series('clean', 'scaffold', gulp.parallel('scripts-deploy', 'styles-deploy', 'images-deploy'), 'html-deploy'));