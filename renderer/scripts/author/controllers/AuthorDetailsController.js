(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.author').controller('AuthorDetailsController', ['$scope', '$routeParams', 'authorService', AuthorDetailsController]);

    function AuthorDetailsController($scope, $routeParams, authorService) {
        var vm = this;

        // Variables
        vm.author = {};

        // Promises
        authorService.getAuthor($routeParams.uid).then((author) => vm.author = author);

        // Functions
    }

})();