'use strict';

/* global require */
var gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
var connect = require('gulp-connect');
var hb = require("gulp-hb");
var minify = require("gulp-minify");
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');``

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['>2%', 'last 2 versions']
		}))
		.pipe(minify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css'))
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

gulp.task('js', function (cb) {
	gulp.src('src/js/*.js')
		.pipe(minify())
		.pipe(gulp.dest('dist/js/'));
	cb();
});

gulp.task('move', function (cb) {
	gulp.src("./src/img/**/*.*")
		.pipe(gulp.dest('./dist/img/'));
	cb();
});

gulp.task('build', function (cb) {
	gulp.series(['sass', 'handlebars', 'move', 'js']);
	cb();
});

gulp.task('watch', function (cb) {
	gulp.watch(['./src/**/*.hbs', './src/*.html'], gulp.series('handlebars'));
	gulp.watch('./src/sass/*.scss', gulp.series('sass'));
	gulp.watch('./src/img/**/*.*', gulp.series('move'));
	gulp.watch('./src/js/*.js', gulp.series('js'));
	gulp.watch("./dist/**/*.*", gulp.series("reload"));
	cb();
});