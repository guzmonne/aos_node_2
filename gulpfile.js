var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat  = require('gulp-concat');
var watch   = require('gulp-watch');

gulp.task('default', function(){
	gulp.src([
						'./client/app.js',
						'./client/models/*.js',
						'./client/collections/*.js',
						'./client/views/**/*.js',
						'./client/routers/*.js',
						'./client/templates/**/*.js',
					])
		.pipe(watch(function(files){
			return files
				.pipe(jshint())
				.pipe(jshint.reporter(stylish))
				.pipe(concat('client.js'))
				.pipe(gulp.dest('./public/js/'))	
		}));
});