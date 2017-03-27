(function () {

    'use strict';

    var toggle = angular.module('app.directives.toggle', []);

    toggle.directive("toggle", [function () {

        var DEFAULT_CLASS = "hidden";

        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '<' + tag + ' ng-transclude></' + tag + '>',
            templateUrl: 'directives/views/toggle.html',
            // replace: true,
            transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function ($scope, elem, attrs, controller) {

                var caret = function (closed) {
                    return 'fa-' + (closed ? 'caret-down' : 'caret-right');
                };

                angular.element(elem[0].querySelector('.fa')).addClass(caret(true));

                var callback = function () {
                    var elements = angular.element(document.querySelector(attrs.toggle));
                    var closed = elements.hasClass('hidden');
                    angular.element(elem[0].querySelector('.fa')).addClass(caret(closed)).removeClass(caret(!closed));
                    elements.toggleClass("hidden");
                };

                if (attrs.toggleInit === 'close' || attrs.toggleInit == 0) {
                    callback();
                }

                elem.bind("click", callback);
            }
        };
    }]);

})();
