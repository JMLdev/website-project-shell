'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
const hb = require("gulp-hb");
const minify = require("gulp-minify");
sass.compiler = require('node-sass');

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
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
		.pipe(gulp.dest('./dist'))
});

gulp.task('js', function (cb) {
	gulp.src('src/js/*.js')
		.pipe(minify())
		.pipe(gulp.dest('dist/js/'))
	cb();
});

gulp.task('move', function (cb) {
	gulp.src("./src/img/**/*.*")
		.pipe(gulp.dest('./dist/img/'));
	cb();
});

gulp.task('build', function (cb) {
	gulp.series('sass');
	gulp.series('handlebars');
	gulp.series('move');
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