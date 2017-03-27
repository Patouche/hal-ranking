(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.author').controller('AuthorImportController', ['$scope', '$document', 'authorImportService', 'authorService', AuthorImportController]);

    /**
     * Class constructor.
     *
     * @param $document
     * @constructor
     */
    function AuthorImportController($scope, $document, authorImportService, authorService) {
        var vm = this;

        vm.csv = reset(';');
        // vm.csv = reset(';', '/home/patouche/projets/amelie/mimette-app/e2e-tests/sample.csv');
        // vm.csv = reset(';', '/home/patouche/projets/amelie/hal-app/e2e-tests/sample.csv');
        // vm.csv = reset(',', '/home/patouche/projets/amelie/hal-app/e2e-tests/sample-big-random.csv');
        //vm.csv = reset(';', '/home/pallain/perso/projects/mimette-app/e2e-tests/sample.csv');
        //vm.csv = reset(',', '/home/pallain/perso/projects/mimette-app/e2e-tests/sample-big-random.csv');
        vm.result = {};
        vm.delimiters = {
            ";": "Point virgule",
            ",": "Virgule",
            ":": "Deux points"
        };
        vm.imports = imports;
        vm.analyse = analyse;
        vm.hasErrors = hasErrors;

        // Events
        $document.on('dragenter dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $document.on('drop', function (e) {
            if (e.dataTransfer.files.length > 1) {
                vm.errors.push("Un seul fichier à la fois !")
            }
            vm.csv.path = e.dataTransfer.files[0].path;
            e.preventDefault();
            e.stopPropagation();
        });

        $scope.$watch((s) => vm.csv.path, function (newVal, oldValue) {
                if (newVal !== undefined) {
                    console.log("CSV has been defined to : ", newVal);
                    analyse(vm.csv.delimiter);
                }
            }
        );

        // Promise ****************

        // Functions **************

        function reset(delimiter, path) {
            return {
                path: path || undefined,
                delimiter: delimiter || ';',
                headers: [],
                lastname: -1,
                firstname: -1,
                errors: []
            };
        }

        // Analyse CSV
        function analyse(delimiter) {
            var path = vm.csv.path;
            if (path == undefined) {
                throw new Error("Cannot analyse csv without information of its location");
            }
            vm.result = {};
            vm.csv.nbRows = 0;
            console.log("Analyse CSV file '%s' with delimiter : %s", path, delimiter);
            authorImportService.getHeaders(path, delimiter).then((headers) => {
                console.log("Define headers : %s (%s)", headers, typeof headers);
                vm.csv.headers = headers;
            }, () => vm.csv.headers = []);
            authorImportService.csvNumberRows(path, delimiter).then((c) => vm.result.rows = c - 1);
        }

        // Imports authors
        function imports() {
            vm.errors = [];
            var callback = (status) => (res) => {
                vm.result = Object.assign(vm.result, {status: status}, res);
                // console.log("Result : ", vm.result);
            };
            authorService.importCsv(vm.csv.path, vm.csv.delimiter, vm.csv.headers, vm.csv.firstname, vm.csv.lastname)
                .then(callback(true), callback(true), callback(false));
        }

        function hasErrors() {
            return vm.result.errors
                && vm.result.errors.length > 0;
        }

    }
})();
