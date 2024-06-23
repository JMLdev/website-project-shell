'use strict';

/* global require */
const gulp = require('gulp');
const connect = require('gulp-connect');
const hb = require("gulp-hb");
const minify = require("gulp-minify");
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const yargs = require('yargs');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));

// flags defined in src\data\globals.js
const PROD = !!(yargs.argv.prod);
const CONDITION = !!(yargs.argv.condition);

// Dynamic import for ES modules
async function loadAutoprefixer() {
    const autoprefixerModule = await import('gulp-autoprefixer');
    return autoprefixerModule.default;
}

function generateSassPath() {
    return './src/sass/**/*.scss';
}

function generateJsFiles() {
    // add additional files for concat as needed
    return ['./src/js/scripts.js'];
}

gulp.task('sass', async function () {
    const autoprefixer = await loadAutoprefixer();
    return gulp.src(generateSassPath())
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(autoprefixer({
                overrideBrowserslist: [
                    "defaults",
                    "not IE 11",
                    "maintained node versions"
                ]
            }))
            .pipe(rename('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(connect.reload());
});

gulp.task('connect', function (cb) {
    connect.server({
        root: 'dist',
        livereload: true
    });
    cb();
});

gulp.task('reload', function (cb) {
    gulp.src('./dist/**/*.*')
        .pipe(connect.reload());
    cb();
});

gulp.task('handlebars', function () {
    return gulp
        .src('./src/*.html')
        .pipe(hb()
            .partials('./src/partials/**/*.hbs')
            .helpers('./src/helpers/*.js')
            .data('./src/data/**/*.{js,json}')
        )
        .pipe(gulp.dest('./dist'));
});

gulp.task('core-js', function() {
    return gulp.src(generateJsFiles())
        .pipe(concat('scripts.js')) // output file
        .pipe(minify())
        .pipe(gulp.dest('dist/js'));
});

// for files that you don't want loaded in the concatenated output file
gulp.task('other-js', function() {
    return gulp.src('src/js/**/!(core-cl|auto-delete|translate-gdpr).js')
        .pipe(minify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('move', function (cb) {
    gulp.src("./src/img/**/*.*")
        .pipe(gulp.dest('./dist/img/'));
    cb();
});

gulp.task('build', gulp.series(
    gulp.parallel('sass', 'handlebars'),
    'move',
    'core-js'
));

gulp.task('watch', function (cb) {
    gulp.watch(['./src/**/*.hbs', './src/*.html'], gulp.series(['handlebars']));
    gulp.watch('./src/sass/**/*.scss', gulp.series(['sass']));
    gulp.watch('./src/img/**/*.*', gulp.series('move'));
    gulp.watch('./src/js/*.js', gulp.series('core-js'));
    gulp.watch("./dist/**/*.*", gulp.series("reload"));
    cb();
});
