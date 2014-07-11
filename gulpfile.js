var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	watch = require('gulp-watch'),
	// changed = require('gulp-changed'),
	mocha = require('gulp-mocha'),
	cover = require('gulp-coverage'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
	colors = require('colors');

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./index.js', './lib/**/*.js','./routes/**/*.js'],
	'tests':['./test/**/*.js']
};


var libs = [
    //- Common
    "./public/js/lib/underscore/underscore-1.5.1.js",
    "./public/js/lib/jquery/jquery-1.10.2.js",
    "./public/js/lib/async/async.js",

    //- Bootstrap Components
    './public/js/lib/bootstrap/collapse.js',
    './public/js/lib/bootstrap/dropdown.js',
    './public/js/lib/bootstrap/tooltip.js',
    './public/js/lib/bootstrap/button.js',

    //- Other Components
    "./public/js/lib/bootstrap-colorpicker/bootstrap-colorpicker.js",
    "./public/js/lib/moment/moment-1.7.2.js",
    "./public/js/lib/move/move-0.1.1.js",
    "./public/js/lib/select2/select2-3.3.2.js",
    "./public/js/lib/pikaday/pikaday-1.1.0.js",
    "./public/js/lib/pikaday/pikaday.jquery-1.1.0.js",
    "./public/js/lib/jquery-placeholder-shim/jquery-placeholder-shim.js",

    // //- Keystone UI
    "./public/js/common/plugins.js",
    "./public/js/common/ui.js",
    "./public/js/common/ui-alt-text.js",
    "./public/js/common/ui-color.js",
    "./public/js/common/ui-sortable.js",

    //- List/Item Specific UI
    './public/js/lib/browserified/querystring.js',
    './public/js/lib/browserified/queryfilter.js',
    "./public/js/common/ui-fixed-toolbar.js",
    "./public/js/lib/joseph-myers/md5.js",
    "./public/js/lib/fancybox/jquery.fancybox.pack.js",
    "./public/js/lib/html5sortable/jquery.sortable.js"
];



// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err){
	console.log((err.name+': '+err.plugin+' - '+err.message).red);
	// propogate
	return;
};

// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

});

// gulp for running the mocha tests with default dot reporter
gulp.task('test', function(){
	gulp.src(paths.tests)
		.pipe(mocha({reporter: 'dot'}))
		.on('error', handleError);

});

// gulp for running the mocha tests with spec reporter
gulp.task('spec', function(){
	gulp.src(paths.tests)
        .pipe(cover.instrument({
            pattern: paths.src,
            debugDirectory: '.coverdebug'
        }))
		.pipe(mocha({reporter: 'spec'}))
        .pipe(cover.report({
            outFile: 'coverage.html'
        }))
		.on('error', handleError);

});

gulp.task('build', function() {
  gulp.src(libs)
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/bundle'))
});

// gulp.task('build-css', function() {
//   gulp.src('./static/css/*.css')
//     .pipe(minifyCSS({keepBreaks:true}))
//     .pipe(gulp.dest('./dist/'))
// });

/*
 * auto/watch gulp tasks that will trigger the tests on
 * file changes
 */
gulp.task('autotest', function(){
	gulp.watch(paths.src.concat(paths.tests), ['test']);
});

gulp.task('autospec', function(){
	gulp.watch(paths.src.concat(paths.tests), ['spec']);
});

gulp.task('default', ['lint', 'spec']);
