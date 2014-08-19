var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    mergeStream = require('merge-stream'),
    jshintStylish = require('jshint-stylish'),
    Promise = require('bluebird'),
    args = require('yargs').argv,
    os = require('os'),
    _ = require('lodash');


var shouldMinify = args.minify || false,
    failJshint = false;

// Helper functions
var getCurrentIP = _.memoize(function () {
    var interfaces = os.networkInterfaces(),
        address;

    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            address = interfaces[k][k2];

            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }

    return '127.0.0.1';
});



// TODO: refactor some paths
var paths = {};
paths.app_base = 'app/';
paths.bower_components = paths.app_base + 'bower_components/';
paths.views = ['views/**/*.html'];
paths.scripts = ['**/*.js'];
paths.images = ['**/*.{jpg,png}'];
paths.fonts = ['fonts/**/*.{woff,otf,svg,eot}'];
paths.dist_base = 'dist_gulp/';



/*
processhtml on index.html
copy and minify views/*.html
*/
gulp.task('views', function () {
    var minifyHtmlConf = {
            empty: true,
            quotes: true
        },
        index = gulp.src(paths.app_base + '/index.html')
            .pipe($.processhtml('index.html'))
            //.pipe($.if(shouldMinify, $.minifyHtml(minifyHtmlConf)))
            .pipe($.ifElse(shouldMinify, function(){return $.minifyHtml(minifyHtmlConf);}))
            .pipe(gulp.dest(paths.dist_base)),
        views = gulp.src(paths.views, {cwd: paths.app_base, base: 'app/views'})
            //.pipe($.if(shouldMinify, $.minifyHtml(minifyHtmlConf)))
            .pipe($.ifElse(shouldMinify, function(){return $.minifyHtml(minifyHtmlConf);}))
            .pipe(gulp.dest(paths.dist_base + '/views'));

    return mergeStream(index, views);
});

gulp.task('styles', function () {
    return gulp.src(paths.app_base + '/sass/**')
        .pipe($.rubySass({
            style: 'expanded',
            lineNumbers: true
        }))
        .pipe($.autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 7'))
        //.pipe($.if(shouldMinify, $.cache($.csso())))
        .pipe($.ifElse(shouldMinify, function(){return $.cache($.csso());}))
        .pipe($.concat('main.css'))
        .pipe(gulp.dest(paths.dist_base + 'styles/'));
});

gulp.task('jshint', function () {
    return gulp.src(paths.app_base + '/index.html')
        .pipe($.assets.js())
        .pipe($.ignore.include(/.*app\/scripts\/.*/))
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter(jshintStylish))
        .pipe($.if(failJshint, $.jshint.reporter('fail')));
});

gulp.task('scripts', ['jshint'], function () {
    return gulp.src(paths.app_base + '/index.html')
        .pipe($.assets.js()) //extracts the javascript files from index.html
        .pipe($.ignore.include(/.*app\/scripts\/.*/)) //keep only app/scripts/* files
        .pipe($.ngAnnotate()) //Add angularjs dependency injection annotations
       // .pipe($.if(shouldMinify, $.uglify()))
        .pipe($.ifElse(shouldMinify, function(){return $.uglify();}))
        .pipe($.concat('scripts.js'))
        .pipe(gulp.dest(paths.dist_base + '/scripts/'));
});

gulp.task('vendor', function () {
    return gulp.src(paths.app_base + '/index.html')
        .pipe($.assets.js())
        .pipe($.ignore.include(/.*bower_components.*/))
        .pipe($.ngAnnotate())
        //.pipe($.if(shouldMinify, $.cache($.uglify())))
        .pipe($.ifElse(shouldMinify, function(){return $.cache($.uglify());}))
        .pipe($.concat('vendor.js'))
        .pipe(gulp.dest(paths.dist_base + '/scripts/'))
});

gulp.task('images', function () {
    return gulp.src(paths.images, {cwd: paths.app_base + '/images/'})
        .pipe(gulp.dest(paths.dist_base + 'images/'));
});

gulp.task('fonts', function () {
    console.log('copy fonts',paths.app_base+paths.fonts);
    return gulp.src(paths.app_base+paths.fonts)
        .pipe(gulp.dest(paths.dist_base + 'fonts/'));
});

gulp.task('other-resources', function () {
    return gulp.src(paths.app_base + '/cordova.js')
        .pipe(gulp.dest(paths.dist_base));
});

gulp.task('assets', ['images', 'fonts', 'other-resources']);

gulp.task('test', function () {});

gulp.task('watch', ['build'], function () {
    $.livereload.listen();

    gulp.watch(paths.app_base + '/sass/**', ['styles']);
    gulp.watch(paths.app_base + '/scripts/**/*.js', ['scripts']);
    gulp.watch(paths.app_base + '/views/**/*.html', ['views']);
    gulp.watch(paths.dist_base + '/**').on('change', $.livereload.changed);
});

gulp.task('server', function () {
    var http = require('http'),
        connect = require('connect'),
        serveStatic = require('serve-static'),
        compression = require('compression'),
        connectLivereload = require('connect-livereload');

    var app = connect()
        .use(compression())
        .use(connectLivereload({
            port: 35729,
            ignore: ['*']
        }))
        .use(serveStatic(paths.dist_base));

    http.createServer(app).listen(9000);
});

gulp.task('corsproxy', function () {
    var corsProxy = require('corsproxy'),
        httpProxy = require('http-proxy');

    httpProxy.createServer(corsProxy).listen(9292, getCurrentIP());
});


gulp.task('serve', ['watch', 'server'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('build', ['views', 'styles', 'scripts', 'vendor', 'assets']);



gulp.task('default', ['serve']);
