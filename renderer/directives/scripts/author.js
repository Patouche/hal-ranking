(function () {

    'use strict';

    var author = angular.module('app.directives.author', []);

    author.directive("author", [function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/views/author.html',
            scope: {
                author: '=val',
                details: '=details'
            }
        };
    }]);

})();
