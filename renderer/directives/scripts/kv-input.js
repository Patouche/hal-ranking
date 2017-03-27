(function () {

    'use strict';

    var kvInput = angular.module('app.directives.kv-input', []);

    kvInput.directive("kvInput", [function () {
        return {
            restrict: 'E',
            // transclude: true,
            templateUrl: 'directives/views/kv-input.html',
            scope: {
                kv: '=kvModel',
                key: '=?kvKey',
                value: '=?kvValue',
                editableKey: '=kvEditableKey',
                editableValue: '=kvEditableValue',
                delete: '&kvDelete'
            },
            controller: ["$scope", KeyValueInputController],
            link: function ($scope, element, attrs, ctrl) {
                if (attrs['kvModel']) {
                    ctrl.buildKeyValue();
                }
            }
        };
    }]);

    function KeyValueInputController($scope) {
        this.buildKeyValue = function () {
            $scope.key = $scope.kv.key;
            $scope.value = $scope.kv.value;
        };
    }


})();
