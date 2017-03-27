(function () {

    'use strict';

    angular.module('app.request', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/requests', {templateUrl: 'views/requests/list.html'});
            $routeProvider.when('/requests/:uid', {templateUrl: 'views/requests/details.html'});
            $routeProvider.when('/requests/:uid/edit', {templateUrl: 'views/requests/edit.html'});
        }]);
})();
