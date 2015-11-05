/**
 * Files patterns used in the GruntFile
 */
var constants = {
    // File patterns for app, component, and debug templates (used for dev vs prod compilation)
    APP_TEMPLATES: ['src/app/**/*.tpl.html', '!src/app/**/*.debug.tpl.html'],
    APP_DEBUG_TEMPLATES: ['src/app/**/*.debug.tpl.html'],
    COMPONENT_TEMPLATES: ['src/components/**/*.tpl.html', '!src/components/**/*.debug.tpl.html'],
    COMPONENT_DEBUG_TEMPLATES: ['src/components/**/*.debug.tpl.html'],

    // File pattern for the production JS files (all JS minus all development files)
    APP_JS_FILES: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],

    VENDOR_ASSET_FILES: [
        'vendor/font-awesome/fonts/*',
        'vendor/bootstrap/fonts/*'
    ],
    VENDOR_CSS_FILES: [],

    // Canonical list of 3rd party files that need to be built into the minified JS file.
    VENDOR_JS_FILES: [
        'vendor/angular/angular.js',
        'vendor/angular-aria/angular-aria.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/underscore/underscore.js',
        'vendor/restangular/dist/restangular.js',
        'vendor/angular-translate/angular-translate.js',
        'src/plugins/steelToe/steelToe.js',
        'src/plugins/boomerang/boomerang.js',
        'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'vendor/angular-cookies/angular-cookies.js',
        'vendor/es6-promise/promise.js',
        'vendor/js-data/dist/js-data.js',
        'vendor/js-data-http/dist/js-data-http.js',
        'vendor/js-data-angular/dist/js-data-angular.js'
    ],
    ANALYTICS_JS_FILES: [
        'src/assets/analytics/tealeaf/tealeaf.4.0.0.1607.js'
    ],

    // File patterns for test files
    TEST_SUPPORT_FILES: [ 'vendor/angular-mocks/angular-mocks.js', 'spec/angular/**/*.js' ],
    UNIT_TESTS: ['src/**/*.spec.js'],

    BAZAARVOICE: {
        STG: {
            baseUrl: "https://stg.api.bazaarvoice.com",
            passKey: "q7pvzrjaun87rsfhuq9spveg"
        },
        PROD: {
            baseUrl: "https://api.bazaarvoice.com",
            passKey: "eu6nb5pz9oeg64sb575qka4bp"
        }
    },
    SERVER_MAP: {
        dev: {
            holland: {
                upstream: 'haldev.hq.halw.com',
                frontend: "https://qa.hollandamerica.com",
                frontendMedia: "http://media.hollandamerica.com",
                frontendBooking: "https://testbook.hollandamerica.com",
                //The line below is saved for historical purposes until we know that the new config works
                //tealeafTargetServer: "https://halsea1lt001.hq.halw.com"
                tealeafTargetServer: "https://halsea1lt004.hq.halw.com:8983"
            },
            seabourn: {
                upstream: 'sbndev.hq.halw.com',
                frontend: "https://qa.seabourn.com",
                frontendBooking: "https://testbook.seabourn.com",
                tealeafTargetServer: "https://halsea1lt004.hq.halw.com:8983"
            }
        },
        e2e: {
            holland: {
                upstream: 'haldev.hq.halw.com',
                frontend: "https://qa.hollandamerica.com",
                frontendMedia: "http://media.hollandamerica.com",
                frontendBooking: "https://testbook.hollandamerica.com",
                tealeafTargetServer: "https://halsea1lt004.hq.halw.com:8983"
            },
            seabourn: {
                upstream: 'sbndev.hq.halw.com',
                frontend: "https://qa.seabourn.com",
                frontendBooking: "https://testbook.seabourn.com",
                tealeafTargetServer: "https://halsea1lt004.hq.halw.com:8983"
            }
        },
        iqa: {
            holland: {
                upstream: 'qabook.hollandamerica.com',
                frontend: "https://qa.hollandamerica.com",
                frontendMedia: "http://media.hollandamerica.com",
                frontendBooking: "https://testbook.hollandamerica.com",
                tealeafTargetServer: "https://halsea1lt004.hq.halw.com:8983"
            },
            seabourn: {
                upstream: 'qabook.seabourn.com',
                frontend: "https://qa.seabourn.com",
                frontendBooking: "https://testbook.seabourn.com",
                tealeafTargetServer: "https://halsea1lt004.hq.halw.com:8983"
            }
        },
        stage: {
            holland: {
                upstream: 'stagebook.hollandamerica.com',
                frontend: "https://stage.hollandamerica.com",
                frontendMedia: "http://media.hollandamerica.com",
                frontendBooking: "https://stagebook.hollandamerica.com",
                tealeafTargetServer: "https://hal-ws-vip-stg.hq.halw.com:8983"
            },
            seabourn: {
                upstream: 'stagebook.seabourn.com',
                frontend: "https://stage.seabourn.com",
                frontendBooking: "https://stagebook.seabourn.com",
                tealeafTargetServer: "https://hal-ws-vip-stg.hq.halw.com:8983"
            }
        },
        prod: {
            holland: {
                upstream: 'hollandamerica.com',
                frontend: "https://www.hollandamerica.com",
                frontendMedia: "http://media.hollandamerica.com",
                frontendBooking: "https://book.hollandamerica.com",
                tealeafTargetServer: "https://book.hollandamerica.com"
            },
            seabourn: {
                upstream: 'book.hollandamerica.com',
                frontend: "https://www.seabourn.com",
                frontendBooking: "https://book.seabourn.com",
                tealeafTargetServer: "https://book.hollandamerica.com"
            }
        }
    }
};

module.exports = constants;