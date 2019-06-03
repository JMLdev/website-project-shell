'use strict';

/* global require */
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var hb = require("gulp-hb");
var minify = require("gulp-minify");
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
sass.compiler = require('node-sass');

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/sass/css'))
		.pipe(connect.reload());
});

gulp.task('prefix', function() {
	return gulp.src('./src/sass/css/**/*.css')
	.pipe(sourcemaps.init())
	.pipe(autoprefixer({
		browsers: ['last 2 versions']
	}))
	.pipe(concat('all.css'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/css/'));
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
	gulp.series('sass');
	gulp.series('prefix');
	gulp.series('handlebars');
	gulp.series('move');
	gulp.series('js');
	cb();
});

gulp.task('watch', function (cb) {
	gulp.watch(['./src/**/*.hbs', './src/*.html'], gulp.series('handlebars'));
	gulp.watch('./src/sass/*.scss', gulp.series('sass'));
	gulp.watch('./src/sass/css/*.css', gulp.series('prefix'));
	gulp.watch('./src/img/**/*.*', gulp.series('move'));
	gulp.watch('./src/js/*.js', gulp.series('js'));
	gulp.watch("./dist/**/*.*", gulp.series("reload"));
	cb();
});