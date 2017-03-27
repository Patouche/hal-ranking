(function () {

    'use strict';

    angular.module('app.tuto', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/tuto', {
                templateUrl: 'views/tuto/index.html'
            });
        }]);
})();
