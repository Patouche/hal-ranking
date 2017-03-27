(function () {

    'use strict';

    const Prism = require('prismjs');

    var hlCode = angular.module('app.directives.hl-code', []);

    hlCode.directive("hlCode", [function () {
        return {
            restrict: 'E',
            // transclude: true,
            templateUrl: 'directives/views/hl-code.html',
            scope: {
                kv: '=kvModel',
                key: '=?kvKey',
                value: '=?kvValue',
                editableKey: '=kvEditableKey',
                editableValue: '=kvEditableValue',
                delete: '&kvDelete'
            },
            controller: ["$scope", PrismHighlighterController]
        };
    }]);

    var PrismHighlighterController = function () {
        var html = Prism.highlight("var data = 1;", Prism.languages.javascript);
    };




})();
