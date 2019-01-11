'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
	return gulp.src('./sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css'));
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

gulp.task('watch', function (cb) {
	gulp.watch('./dist/*.html', gulp.series('html'));
	gulp.watch('./sass/*.scss', gulp.series('sass'));
	cb();
});