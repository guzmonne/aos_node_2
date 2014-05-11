var gulp       = require('gulp');
var jshint     = require('gulp-jshint');
var stylish    = require('jshint-stylish');
var concat     = require('gulp-concat');
var watch      = require('gulp-watch');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS  = require('gulp-minify-css');
var handlebars = require('gulp-handlebars');
var declare		 = require('gulp-declare');

var jsFiles = [
								'./client/app.js',
								'./client/mixins/*.js',
								'./client/models/*.js',
								'./client/collections/*.js',
								'./client/views/**/*.js',
								'./client/routers/*.js',
								'./client/templates/**/*.js',
								'./client/start.js',
							];

var specFiles = [
									'./tests/spec/app/*.js',
									'./tests/spec/mixins/*.js',
									'./tests/spec/models/*.js',
									'./tests/spec/collections/*.js',
									'./tests/spec/views/*.js',
									'./tests/spec/routers/*.js',
								]

// ======= //
// DEFAULT //
// ======= //
gulp.task('default', function(){
	// Run tasks at the beggining
	gulp.run('jshint', 'concat', 'styles', 'handlebars', 'concat-tests', 'jshint-tests');
	// Watch for JS changes
	gulp.watch('./client/**/*.js', function(){
		gulp.run('jshint', 'concat');
	});
	// Watch for CSS changes
	gulp.watch('./public/css/style.css', function(){
		gulp.run('styles');
	});
	// Watch for new Templates
	gulp.watch('./client/templates/**/*.hbs', function(){
		gulp.run('handlebars');
	});
	// Watch for new Specs
	gulp.watch(specFiles, function(){
		gulp.run('jshint-tests', 'concat-tests');
	});
});

// ====== //
// JSHINT //
// ====== //
gulp.task('jshint', function(){
	gulp.src('./client/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

// ============ //
// JSHINT TESTS //
// ============ //
gulp.task('jshint-tests', function(){
	gulp.src(specFiles)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

// ====== //
// CONCAT //
// ====== //
gulp.task('concat', function(){
	gulp.src(jsFiles)
		.pipe(concat('client.js'))
		.pipe(gulp.dest('./public/js/'));
});

// ============ //
// CONCAT TESTS //
// ============ //
gulp.task('concat-tests', function(){
	gulp.src(specFiles)
		.pipe(concat('specs.js'))
		.pipe(gulp.dest('./tests/spec/'));
});

// ============ //
// CSS MINIFIER //
// ============ //
gulp.task('styles', function(){
	gulp.src([
		'./public/css/style.css',
	])
		.pipe(concat('styles.min.css'))
		.pipe(autoprefix('last 2 versions'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./public/css/'));
});

// ========== //
// HANDLEBARS //
// ========== //
gulp.task('handlebars', function(){
	gulp.src('./client/templates/**/*.hbs')
		.pipe(handlebars({
			wrapped: true
		}))
		.pipe(declare({
			namespace: 'HBS'
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('./public/js/'));
});
