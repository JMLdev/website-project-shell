process.env.NODE_OPTIONS = "--max_old_space_size=8192";
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
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const through = require('through2');
const fs = require('fs');
const path = require('path');

const PROD = !!(yargs.argv.prod);
const CONDITION = !!(yargs.argv.condition);

async function loadAutoprefixer() {
	const autoprefixerModule = await import('gulp-autoprefixer');
	return autoprefixerModule.default;
}

function generateSassPath() {
	return './src/sass/**/*.scss';
}

function logFile(file, enc, cb) {
	console.log('Processing file:', file.path);
	cb(null, file);
}

function logFileSize(file, enc, cb) {
	const stats = fs.statSync(file.path);
	console.log(`File size: ${stats.size} bytes - ${file.path}`);
	cb(null, file);
}

function handleError(err) {
	console.error('Error processing file:', err);
	this.emit('end');
}

gulp.task('sass', async function () {
	const autoprefixer = await loadAutoprefixer();
	return gulp.src(generateSassPath())
		.pipe(plumber({ errorHandler: handleError }))
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

gulp.task('reload-html', function (cb) {
	gulp.src('./dist/**/*.html')
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(connect.reload());
	cb();
});

gulp.task('reload-css', function (cb) {
	gulp.src('./dist/css/**/*.css')
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(connect.reload());
	cb();
});

gulp.task('reload-js', function (cb) {
	gulp.src('./dist/js/**/*.js')
		.pipe(plumber({ errorHandler: handleError }))
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
		.pipe(through.obj(logFile))  // Add logging
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

gulp.task('core-js', function () {
	return gulp.src('./src/js/**/*.js')
		.pipe(plumber({ errorHandler: handleError })) // Handle errors without stopping the watch process
		.pipe(through.obj(logFileSize)) // Log file size
		.pipe(concat('scripts.js'))
		.pipe(minify())
		.pipe(through.obj(logFile)) // Add logging
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());
});

gulp.task('other-js', function () {
	return gulp.src('src/js/**/!(core-cl|auto-delete|translate-gdpr).js')
		.pipe(plumber({ errorHandler: handleError })) // Handle errors without stopping the watch process
		.pipe(minify())
		.pipe(through.obj(logFile))  // Add logging
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());
});

function copyRecursiveSync(src, dest) {
	const exists = fs.existsSync(src);
	const stats = exists && fs.statSync(src);
	const isDirectory = exists && stats.isDirectory();

	if (isDirectory) {
		fs.mkdirSync(dest, { recursive: true });
		fs.readdirSync(src).forEach((childItemName) => {
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} else {
		fs.copyFileSync(src, dest);
	}
}

gulp.task('move-images', function (cb) {
	const source = './src/img/';
	const destination = './dist/img/';

	copyRecursiveSync(source, destination);
	cb();
});

gulp.task('move-videos', function () {
	return gulp.src("./src/video/**/*.*", { buffer: false }) // Stream mode
		.pipe(plumber({ errorHandler: handleError })) // Handle errors without stopping the watch process
		.pipe(through.obj(logFile))  // Add logging
		.pipe(gulp.dest('./dist/video/'))
		.pipe(connect.reload());
});

gulp.task('build', gulp.series(
	gulp.parallel('sass', 'handlebars'),
	'move-images',
	'move-videos',
	'core-js'
));

gulp.task('watch', function (cb) {
	gulp.watch(['./src/**/*.hbs', './src/*.html'], gulp.series('handlebars', 'reload-html'));
	gulp.watch('./src/sass/**/*.scss', gulp.series('sass', 'reload-css'));
	gulp.watch('./src/img/**/*.*', gulp.series('move-images'));
	gulp.watch('./src/video/**/*.*', gulp.series('move-videos'));
	gulp.watch('./src/js/*.js', gulp.series('core-js', 'reload-js'));
	cb();
});

gulp.task('default', gulp.series('build', gulp.parallel('connect', 'watch')));
