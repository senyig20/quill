require('dotenv').load({silent: true});

const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');

const environment = process.env.NODE_ENV;

const nodemon = require('gulp-nodemon');

function swallowError(error) {
    //If you want details of the error in the console
    console.log(error.toString());
    this.emit('end');
}

gulp.task('default', function () {
    console.log('yo. use gulp watch or something');
});

gulp.task('js', function () {
    if (environment !== 'dev') {
        // Minify for non-development
        gulp.src(['app/client/src/**/*.js', 'app/client/views/**/*.js'])
            .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .on('error', swallowError)
            .pipe(uglify())
            .pipe(gulp.dest('app/client/build'));
    } else {
        gulp.src(['app/client/src/**/*.js', 'app/client/views/**/*.js'])
            .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .on('error', swallowError)
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('app/client/build'));
    }

});

gulp.task('sass', function () {
    gulp.src('app/client/stylesheets/site.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(minifyCss())
        .pipe(gulp.dest('app/client/build'));
});

gulp.task('build', ['js', 'sass'], function () {
    // Yup, build the js and sass.
});

gulp.task('watch', ['js', 'sass'], function () {
    gulp
        .watch('app/client/src/**/*.js', ['js']);
    gulp
        .watch('app/client/views/**/*.js', ['js']);
    gulp
        .watch('app/client/stylesheets/**/*.scss', ['sass']);
});

gulp.task('server', ['watch'], function () {
    nodemon({
        script: 'app.js',
        env: {'NODE_ENV': process.env.NODE_ENV || 'DEV'},
        watch: [
            'app/server'
        ]
    });
});
