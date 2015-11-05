/**
 * @param --browsers=Chrome,Firefox,PhantomJS - Runs unit tests in a specific browser instance, allows comma-separated list.
 * @param --reporters=dots,spec - Runs unit tests with a specific reporter, allows comma-separated list.
 * @param --env=[dev,e2e,iqa,prod] (default:dev)- Sets the environment for the application configuration.
 * @param --suite=[smoke,full] (default:smoke) - Runs the protractor tests using a certain suite of files.
 * @param --app=[holland,seabourn] (default:holland) - Sets the upstream domain to haldev.hq.halw.com, or sbndev.hq.halw.com, depending on the environment
 * @param --upstream=[IP,URL] - sets the upstream server for the proxy configuration
 *
 * TODO: compress task -- create holland.tar.gz and seabourn.tar.gz
 */

var constants                = require('./config/constants'),
    helpers                  = require('./config/helpers'),
    unitTest                 = require('./config/unitTest'),
    releaseTasks             = require('./config/releaseTasks'),
    ApplicationConfiguration = require('./config/ApplicationConfiguration'),
    BuildConfiguration       = require('./config/BuildConfiguration'),
    pkg                      = require('./package.json'),
    gulp                     = require('gulp'),
    jshint                   = require('gulp-jshint'),
    clean                    = require('del'),
    less                     = require('gulp-less'),
    uglify                   = require('gulp-uglify'),
    livereload               = require('gulp-livereload'),
    plato                    = require('plato'),
    cssmin                   = require('gulp-cssmin'),
    rename                   = require('gulp-rename'),
    concat                   = require('gulp-concat'),
    webserver                = require('gulp-webserver'),
    html2js                  = require('gulp-html2js'),
    jasmine                  = require('gulp-jasmine'),
    copy                     = require('gulp-copy'),
    flatten                  = require('gulp-flatten'),
    taskListing              = require('gulp-task-listing'),
    sourcemaps               = require('gulp-sourcemaps'),
    template                 = require('gulp-template'),
    flatGlob                 = require('flatten-glob'),
    ngConstant               = require('gulp-ng-constant'),
    shell                    = require('gulp-shell'),
    bump                     = require('gulp-bump'),
    tagVersion               = require('gulp-tag-version'),
    tap                      = require('gulp-tap'),
    jeditor                  = require('gulp-json-editor'),
    Q                        = require('q'),
    protractor               = require('gulp-protractor').protractor,
    argv                     = require('yargs').argv,
    ngDocs                   = require('gulp-ngdocs'),
    reveasy                  = require("gulp-rev-easy"),
    change                   = require('gulp-change'),
    git                      = require('gulp-git');

//
// Arguments
//

var buildConfiguration = new BuildConfiguration(argv);

//
// Helper Functions
//
var nextVersion = helpers.getNextVersion();


var onFileChange = function (event) {
    unitTest.onFileChange(event, false, buildConfiguration.environment, buildConfiguration.testBrowsers, buildConfiguration.karmaReporters);
};

function getTemplateJSFiles() {
    return flatGlob.sync(helpers.mergeArrays(constants.VENDOR_JS_FILES,
        'configuration.js',
        constants.APP_JS_FILES,
        constants.ANALYTICS_JS_FILES.map(function(x){return x.replace('src/', '');}),
        'templates-app.js',
        'templates-components.js'));
}

function getAssetsFiles() {
    return helpers.mergeArrays(constants.VENDOR_JS_FILES,
        constants.APP_JS_FILES,
        constants.ANALYTICS_JS_FILES);
}

function protractorTest() {
    var args = ['--suite', buildConfiguration.testSuite];

    // use --jasmineNodeOpts.showColors=0 to disable colored output
    // see https://github.com/juliemr/minijasminenode/tree/jasmine1
    if(argv.jasmineNodeOpts) {
        for(var key in argv.jasmineNodeOpts){
            args = args.concat([ '--jasmineNodeOpts.'+key, argv.jasmineNodeOpts[key] ]);
        }
    }

    if (buildConfiguration.testBrowsers) {
        args = args.concat(['--browsers', buildConfiguration.testBrowsers]);
    }
    return gulp.src(['./spec/smoke/**/*.spec.js'])
        .pipe(protractor({
            seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',
            configFile       : './spec/conf/protractor.e2eTests.js',
            debug            : false,
            args             : args
        }))
        .on('end', function () {
            process.exit(0);
        })
        .on('error', function (e) {
            throw e
        });
}

gulp.task('help', taskListing);

gulp.task('clean', function () {
    return clean(['./build', './bin']);
});

gulp.task('halLess', function () {
    var stream = gulp.src('./src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less());

    stream.on('error', function (error) {
        helpers.errorHandler(error, 'halLess', !helpers.webserverStarted);
    });

    stream.pipe(rename('secondaryFlow.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/hal/assets'));
    return stream;
});
gulp.task('sbnLess', function () {
    var stream = gulp.src('./src/less/main.sbn.less')
        .pipe(sourcemaps.init())
        .pipe(less());

    stream.on('error', function (error) {
        helpers.errorHandler(error, 'sbnLess', !helpers.webserverStarted);
    });

    stream.pipe(rename('secondaryFlow.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/sbn/assets'));
    return stream;
});

gulp.task('appTemplates', function () {
    return gulp.src(constants.APP_TEMPLATES, {base: '.'})
        .pipe(html2js({
            outputModuleName: 'templates-app',
            base            : 'src/app'
        }))
        .pipe(concat('templates-app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/hal'))
        .pipe(gulp.dest('./build/sbn'));
});
gulp.task('componentTemplates', function () {
    return gulp.src(constants.COMPONENT_TEMPLATES, {base: '.'})
        .pipe(html2js({
            outputModuleName: 'templates-components',
            base            : 'src/components'
        }))
        .pipe(concat('templates-components.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/hal'))
        .pipe(gulp.dest('./build/sbn'));
});
gulp.task('halIndexTemplate', ['appTemplates', 'componentTemplates', 'halLess', 'sbnLess'], function () {
    return gulp.src('src/index.html', {base: './src'})
        .pipe(template({
            styles : [].concat(['assets/secondaryFlow.css'], constants.VENDOR_CSS_FILES),
            scripts: getTemplateJSFiles(),
            version: nextVersion
        }))
        .pipe(gulp.dest('./build/hal'));
});
gulp.task('sbnIndexTemplate', ['appTemplates', 'componentTemplates', 'halLess', 'sbnLess'], function () {
    return gulp.src('src/index.html', {base: './src'})
        .pipe(template({
            styles : [].concat(['assets/secondaryFlow.css'], constants.VENDOR_CSS_FILES),
            scripts: getTemplateJSFiles(),
            version: nextVersion
        }))
        .pipe(gulp.dest('./build/sbn'));
});

//move assets to build folders
gulp.task('halAssets', function () {
    return gulp.src(getAssetsFiles(), {"base": "."})
        .pipe(copy('./build/hal'));
});
gulp.task('sbnAssets', function () {
    return gulp.src(getAssetsFiles(), {"base": "."})
        .pipe(copy('./build/sbn'));
});
gulp.task('halVendorFonts', function () {
    return gulp.src(constants.VENDOR_ASSET_FILES, {"base": "."})
        .pipe(flatten())
        .pipe(gulp.dest('./build/hal/assets/fonts'));
});
gulp.task('sbnVendorFonts', function () {
    return gulp.src(constants.VENDOR_ASSET_FILES, {"base": "."})
        .pipe(flatten())
        .pipe(gulp.dest('./build/sbn/assets/fonts'));
});
gulp.task('halAssetsSubdirs', function () {
    return gulp.src('./src/assets/**/*', {"base": "./src/assets"})
        .pipe(gulp.dest('./build/hal/assets'));
});
gulp.task('sbnAssetsSubdirs', function () {
    return gulp.src('./src/assets/**/*', {"base": "./src/assets"})
        .pipe(gulp.dest('./build/sbn/assets'));
});

gulp.task('config', function () {
    function performChange(content) {
        //content is a string
        jsonConfig = JSON.parse(content);
        var appName = jsonConfig.appName;

        var applicationConfiguration = new ApplicationConfiguration(appName.toUpperCase(),
            buildConfiguration.projectName,
            buildConfiguration.environment,
            jsonConfig.longAppName);

        //append json file to ApplicationConfiguration
        for(var i in jsonConfig){
            applicationConfiguration.constants.Configuration[i] = jsonConfig[i];
        }

        return JSON.stringify(applicationConfiguration);
    }

    return gulp.src('./config/ApplicationConfiguration/**/configuration.json')
        .pipe(change(performChange))
        .pipe(ngConstant())
        .pipe(gulp.dest('./build/'));
});

gulp.task('build',
    [
        'ngDocs',
        'plato',
        'lint',
        'halLess',
        'sbnLess',
        'halAssets',
        'sbnAssets',
        'halAssetsSubdirs',
        'sbnAssetsSubdirs',
        'halVendorFonts',
        'sbnVendorFonts',
        'appTemplates',
        'componentTemplates',
        'halIndexTemplate',
        'sbnIndexTemplate',
        'config'
    ]
);

gulp.task('buildFast',
    [
        'halLess',
        'sbnLess',
        'halAssets',
        'sbnAssets',
        'halAssetsSubdirs',
        'sbnAssetsSubdirs',
        'halVendorFonts',
        'sbnVendorFonts',
        'appTemplates',
        'componentTemplates',
        'halIndexTemplate',
        'sbnIndexTemplate',
        'config'
    ]
);

//lint performs a jshint on a directory
gulp.task('lint', function () {
    return gulp.src(helpers.mergeArrays(constants.APP_JS_FILES, constants.UNIT_TESTS))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-smart'))
        .pipe(jshint.reporter('fail'));
});
gulp.task('lintUnitTests', function () {
    return gulp.src(helpers.mergeArrays(constants.UNIT_TESTS))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-smart'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('ngDocs', function () {
    var options = {
        startPage  : '/services',
        title      : "Secondary Flow Docs",
        html5Mode  : false,
        bestMatch  : true,
        navTemplate: 'ngdocs.helper.html'
    };
    // TODO: ITDO-440
    // include     "gulp-ngdocs": "^0.2.10", in package.json
    //return true;
    return ngDocs.sections({
        'directives': {
            glob : ['src/components/directives/**/*.js'],
            api  : true,
            title: 'Directives'
        },
        'services'  : {
            glob : ['src/components/services/**/*.js'],
            api  : true,
            title: 'Services'
        },
        'filters'   : {
            glob : ['src/components/filters/**/*.js'],
            api  : true,
            title: 'Filters'
        }
    }).pipe(ngDocs.process(options))
        .pipe(gulp.dest('build/docs'));
});

gulp.task('unit', ['lint', 'lintUnitTests'], function () {
    return unitTest.runUnitTests(false, buildConfiguration.environment, buildConfiguration.testBrowsers, buildConfiguration.karmaReporters);
});
gulp.task('unitSmoke', ['lint', 'lintUnitTests'], function () {
    return unitTest.runUnitTests(true, buildConfiguration.environment, buildConfiguration.testBrowsers, buildConfiguration.karmaReporters);
});

gulp.task('killSelenium', shell.task(['sh ./spec/scripts/killSelenium.sh']));
gulp.task('qa', ['killSelenium', 'webserver'], function () {
    return protractorTest();
});
gulp.task('smokeTests', ['killSelenium', 'webserver', 'unitSmoke'], function () {
    return protractorTest();
});

gulp.task('bump', function () {
    var version  = null;
    var deferred = Q.defer();
    gulp.src(['package.json', 'bower.json'])
        .pipe(bump())
        .pipe(tap(function (file) {
            if (version) {
                return;
            }
            var json = JSON.parse(String(file.contents));
            version  = json.version;

            pkg.version = version;
        }))
        .pipe(gulp.dest('./'))
        .on('end', function () {
            gulp.src(['version.txt'])
                .pipe(jeditor(function (json) {
                    json.versionInfo.version = version;
                    return json;
                }))
                .pipe(gulp.dest('./'))
                .pipe(git.commit('Releasing version ' + version))
                .pipe(git.tag("v" + version, 'Releasing version ' + version, function (err) {
                    if (err) {
                        deferred.reject();
                        throw err;
                    }
                }))
                .on('end', function () {
                    deferred.resolve();
                })
                .on('error', function (e) {
                    throw e;
                });
        });
    return deferred.promise;
});

/** plato is a report generator
 */
gulp.task('plato', function () {
    var deferred = Q.defer();
    var files = flatGlob.sync(['./src/app/**/*.js', '!./src/app/**/*.spec.js']);
    var outputDir = './build/docs/plato';
    var options = {
        complexity: {
            trycatch: true
        }
    };

    function done(report){
        deferred.resolve(report);
    }

    plato.inspect(files, outputDir, options, done);

    return deferred.promise;
});

gulp.task('startHALServerFast', ['buildFast'], function () {
    //ignore certificate errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return helpers.startWebServer('./build/hal', 4321, 4322, 'https://' + buildConfiguration.upstream, 'secondaryFlow');
});
gulp.task('startSBNServerFast', ['buildFast'], function () {
    //ignore certificate errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return helpers.startWebServer('./build/sbn', 4040, 4041, 'https://' + buildConfiguration.upstream, 'secondaryFlow');
});

gulp.task('startHALServer', ['build'], function () {
    //ignore certificate errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return helpers.startWebServer('./build/hal', 4321, 4322, 'https://' + buildConfiguration.upstream, 'secondaryFlow');
});
gulp.task('startSBNServer', ['build'], function () {
    //ignore certificate errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return helpers.startWebServer('./build/sbn', 4040, 4041, 'https://' + buildConfiguration.upstream, 'secondaryFlow');
});
gulp.task('startDocsServer', ['build'], function () {
    //ignore certificate errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return helpers.startWebServer('./build/docs', 4001, 4002, 'https://localhost:4321');
});
gulp.task('webserver', ['startHALServer', 'startSBNServer', 'startDocsServer']);
gulp.task('webserverFast', ['startHALServerFast', 'startSBNServerFast']);

// Watch Task (watches for changes)
gulp.task('watch', ['webserver'], function () {
    gulp.watch(constants.APP_TEMPLATES, ['appTemplates']).on('change', onFileChange);
    gulp.watch(constants.COMPONENT_TEMPLATES, ['componentTemplates']).on('change', onFileChange);
    gulp.watch(constants.APP_JS_FILES, ['lint', 'halAssets', 'sbnAssets']).on('change', onFileChange);
    gulp.watch(constants.UNIT_TESTS, ['lintUnitTests', 'halAssets', 'sbnAssets']).on('change', onFileChange);
    gulp.watch('src/assets/**/*', ['halAssetsSubdirs', 'sbnAssetsSubdirs']).on('change', onFileChange);
    gulp.watch('src/**/*.less', ['halLess', 'sbnLess', 'appTemplates']).on('change', onFileChange);
});

// Fast Watch Task (watches for changes without lint or unit)
gulp.task('fast-watch', ['webserverFast'], function () {
    gulp.watch(constants.APP_TEMPLATES, ['appTemplates']).on('change', onFileChange);
    gulp.watch(constants.COMPONENT_TEMPLATES, ['componentTemplates']).on('change', onFileChange);
    gulp.watch(constants.APP_JS_FILES, ['halAssets', 'sbnAssets']).on('change', onFileChange);
    gulp.watch('src/assets/**/*', ['halAssetsSubdirs', 'sbnAssetsSubdirs']).on('change', onFileChange);
    gulp.watch('src/**/*.less', ['halLess', 'sbnLess', 'appTemplates']).on('change', onFileChange);
});

gulp.task('default', ['webserver', 'watch', 'unit']);

// Use these commands only for quick testing and bashing around.
// It skips lint and unit tests.
// Before push or committing code, run the default task "gulp"
gulp.task('fast', ['webserverFast', 'fast-watch']);