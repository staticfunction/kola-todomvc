/**
 * Created by jcabresos on 3/16/15.
 */
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var webserver = require('gulp-webserver');


gulp.task('compile', function() {
	var src = gulp.src(['src/**/*.ts', 'typings/tsd.d.ts'])
		.pipe(typescript({
			module: "commonjs"
		}))

	return src.js.pipe(gulp.dest('build'));

})
gulp.task('package', ['compile'], function() {
	var bundler = browserify({
		entries: ['./build/app.js'],
		debug: true
	})

	bundler.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('js'))
})

gulp.task('launch', function() {
	gulp.src('')
		.pipe(webserver({
			livereload: true,
			directoryListing: false,
			open: true
		}))
})

