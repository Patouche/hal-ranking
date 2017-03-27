(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.author').controller('AuthorListController', ['$location', '$translate', 'toastr', 'authorService', AuthorListController]);

    function AuthorListController($location, $translate, toastr, authorService) {
        var vm = this;

        // Variables
        vm.authors = undefined;

        vm.cleanDatabase = cleanDatabase;
        vm.clearCache = clearCache;


        // Promises
        authorService.getAuthors().then((authors) => vm.authors = authors || []);

        // Functions
        var successNotif = (key) => {
            return () => $translate(key).then(
                (m) => toastr.success(m),
                () => toastr.success(key, 'Success')
            );
        };
        var errorNotif = (e) => toastr.error(e.toString(), "Error");

        function cleanDatabase() {
            authorService.dropAll()
                .then(successNotif('authors.database-clear-success'), errorNotif)
                .then(() => authorService.getAuthors())
                .then((authors) => vm.authors = authors || []);
        }

        function clearCache() {
            authorService.clearCache()
                .then(successNotif('authors.cache-clear-success'), errorNotif);
        }

    }

})();
