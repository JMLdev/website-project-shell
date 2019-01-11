'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
const hb = require("gulp-hb");

sass.compiler = require('node-sass');

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('connect', function (cb) {
	connect.server({
		root: 'dist',
		livereload: true
	});
	cb();
});

gulp.task('html', function (cb) {
	gulp.src('./dist/*.html')
		.pipe(connect.reload());
	cb();
});

gulp.task('handlebars', function() {
	return gulp
		.src('./src/*.html')
		.pipe(hb()
			.partials('./src/partials/**/*.hbs')
			.helpers('./src/helpers/*.js')
			.data('./src/data/**/*.{js,json}')
		)
		.pipe(gulp.dest('./dist'))
});

gulp.task('watch', function (cb) {
	gulp.watch('./src/**/*.hbs', gulp.series('handlebars'));
	gulp.watch('./dist/*.html', gulp.series('html'));
	gulp.watch('./src/sass/*.scss', gulp.series('sass'));
	cb();
});