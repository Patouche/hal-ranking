(function () {

    'use strict';

    angular.module('app.author', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/authors/import', { templateUrl: 'views/authors/import.html' });
            $routeProvider.when('/authors/:uid', {templateUrl: 'views/authors/details.html'});
            $routeProvider.when('/authors', {templateUrl: 'views/authors/list.html'});
        }]);
})();
