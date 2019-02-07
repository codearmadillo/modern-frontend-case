const gulp = require('gulp'),
        sass = require('gulp-sass'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        gutil = require('gulp-util'),
        autoprefixer = require('autoprefixer'),
        sourcemaps = require('gulp-sourcemaps'),
        postcss = require('gulp-postcss'),
        babel = require('gulp-babel');

const dependencies = {
    javascript: Array(
        'src/script/application.js',
        'src/script/**/*.js'
    ),
    stylesheet: Array(
        "src/scss/*.scss",
        "src/scss/**/*.scss"
    )
}

const input = {
    stylesheet: "src/scss/default.scss",
    javascript: dependencies.javascript
}

const output = {
    production: 'production/',
    development: 'build/'
}

gulp.task('default', ['watch']);
gulp.task('watch', ['scss', 'script'], function(){
    gulp.watch(dependencies.stylesheet, ['scss']);
    gulp.watch(dependencies.javascript, ['script']);
});
gulp.task('scss', function() {
    return gulp.src(input.stylesheet)
        .pipe(gutil.env.type !== 'production' ? sourcemaps.init() : gutil.noop())
        .pipe(sass({outputStyle: gutil.env.type !== 'production' ? 'compact' : 'compressed'}).on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe(gutil.env.type !== 'production' ? sourcemaps.write() : gutil.noop())
        .pipe(gutil.env.type !== 'production' ? gulp.dest(output.development) : gulp.dest(output.production));
});
gulp.task('script', function(){
    return gulp.src(input.javascript)
        .pipe(gutil.env.type !== 'production' ? sourcemaps.init() : gutil.noop())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('application.js'))
        .pipe(gutil.env.type !== 'production' ? gutil.noop() : uglify().on('error', gutil.log))
        .pipe(gutil.env.type !== 'production' ? sourcemaps.write() : gutil.noop())
        .pipe(gutil.env.type !== 'production' ? gulp.dest(output.development) : gulp.dest(output.production));
});