(function () {

    'use strict';

    var fileread = angular.module('app.directives.filepath', []);

    fileread.directive("filepath", [function () {
        return {
            scope: {
                filepath: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.filepath = changeEvent.target.files[0].path;
                    });
                    changeEvent.target.files[0].path;
                });
            }
        }
    }]);

})();