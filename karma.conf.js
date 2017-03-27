//jshint strict: false
module.exports = function (config) {
    config.set({

        basePath: 'renderer',

        files: [
            '../node_modules/**/*.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'scripts/**/root.js',
            'scripts/**/*.js',
            'scripts/author/**/*.js',
            'views/**/*.js',
            'app.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
