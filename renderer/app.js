(function () {
    'use strict';

// Declare app level module which depends on views, and components
    var app = angular.module('app', [
        'ngRoute',
        'ngSanitize',
        'ngAnimate',
        'toastr',
        'pascalprecht.translate',
        'app.core',
        'app.tuto',
        'app.author',
        'app.request',
        'app.directives'
    ]);

    app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/authors'});
    }]);


    app.config(['$translateProvider', function ($translateProvider) {
        var files = [{prefix: 'config/translations/', suffix: '.json'}];
        $translateProvider.useStaticFilesLoader({files: files});
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.preferredLanguage('fr');
    }]);

    app.config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: true,
            closeButton: true,
            closeHtml: '<button class="delete"></button>',
            extendedTimeOut: 100000,
            iconClasses: {
                error: 'is-danger',
                info: 'is-primary',
                success: 'is-success',
                warning: 'is-warning'
            },
            //     messageClass: 'toast-message',
            //     onHidden: null,
            //     onShown: null,
            //     onTap: null,
            //     progressBar: false,
            //     tapToDismiss: true,
            // templates: {
            //     toast: 'directives/views/toastr.html',
            //     progressbar: 'directives/views/toastr-progressbar.html'
            // },
            timeOut: 500000,
            //     titleClass: 'toast-title',
            toastClass: 'notification',
            positionClass: 'bottom-right',
            containerId: 'notification-container'
        });
    });


})();
