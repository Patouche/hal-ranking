'use strict';

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const plugins = require('gulp-load-plugins')();
// const plugins = gulpLoadPlugins.gulpLoadPlugins();

let wiredep = require('wiredep').stream;

const sassRoot = 'renderer/scss';
const cssRoot = 'renderer';

const views = 'views/**/*.html';
//const viewsRoot = 'views/';

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// ############################################################################################
// ############################################################################################

gulp.task('clean:styles', (cb) => {
    del([
        '**/.sass-cache/**',
    ], cb);
});

// gulp.task('inject-dependencies', function() {
//     return gulp.src(views)
//         .pipe(wiredep())
//         .pipe(plugins.rename(function(path) {
//             path.extname = '.html';
//         }))
//         .pipe(gulp.dest(viewsRoot));
// });

gulp.task('build-sass', () => {
    return gulp.src(sassRoot+'/*.scss')
        .pipe(plugins.plumber())
        //.pipe(plugins.notify('Compile Sass File: <%= file.relative %>...'))
        //.pipe(plugins.sourcemaps.init())
        //.pipe(plugins.autoprefixer('last 10 versions'))
        .pipe(plugins.sass({ style: 'compressed' }))
        .on('error', handleError)
        .pipe(plugins.cleanCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.concatCss('app.css'))
        .pipe(gulp.dest(cssRoot))
        .pipe(plugins.notify('Compilation finished !'))
        ;
});

// ############################################################################################
// ############################################################################################

gulp.task('watch-sass', () => {
    plugins.notify('Sass Stream is Active...');
    gulp.watch(sassRoot+'/**/*.scss', ['build-sass']);
});

// ############################################################################################
// ############################################################################################

gulp.task('default', ['build-sass'], () => {
    gutil.log('Transposing Sass...');
});

gulp.task('clean', ['clean:styles']);
gulp.task('watch', ['watch-sass']);