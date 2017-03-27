(function () {

    'use strict';

    var fqField = angular.module('app.directives.kv-select', []);

    fqField.directive("kvSelect", [function () {
        return {
            restrict: 'E',
            // transclude: true,
            templateUrl: 'directives/views/kv-select.html',
            scope: {
                kv: '=kvModel',
                items: '=kvItems',
                value: '=kvValue',

                delete: '&kvDelete'
            },
            controller: ['$scope', function KvSelectController($scope) {
                $scope.deletable = ($scope.delete) ? true : false;
                if ($scope.value != null) {
                    $scope.kv = {key: undefined, value: $scope.value};
                }
            }]
        };
    }]);

})();
