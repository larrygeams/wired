var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pump = require('pump');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');

// Convert Sass files into Css files
gulp.task('scss', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-scss', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// Bundle all js files into one single file
gulp.task('js', function() {
    return browserify({ entries: ["js/wired.js"] })
        .bundle()
        .pipe(source('wired.js'))
        .pipe(gulp.dest('dist/js'));
});

// Compress js files
gulp.task('minify-js', function(cb) {
    return gulp.src('js/wired.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Copy files from one directory to another
gulp.task('copy', function() {

    // Dependencies
    gulp.src([
        'node_modules/font-awesome/*/**',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/*/**',
    ], { base: 'node_modules' }).pipe(gulp.dest('plugins'));
});

// Build all assets from Sass to Css and compressed bundle js
gulp.task('build', function() {
    runSequence('copy', 'scss', 'minify-scss', 'js', 'minify-js');
});

// Watch for every changes on both sass and js
gulp.task('watch', function() {
    gulp.watch('**/*.scss', ['scss']);
    gulp.watch('**/*.js', ['js']);
});

// Default Task 
gulp.task('default', ['watch']);
