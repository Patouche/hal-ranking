(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.request').controller('RequestEditController', ['$scope', 'requestCreationService', 'requestRunnerService', 'configService', '$routeParams', RequestEditController]);

    function RequestEditController($scope, requestCreationService, requestRunnerService, configService, $routeParams) {
        var vm = this;

        // Variables
        vm.request = {};
        vm.fields = [];
        vm.result = [];
        vm.addColumn = () => requestCreationService.addColumn();
        vm.addFilter = () => requestCreationService.addFilter();
        vm.save = save;
        vm.run = run;
        vm.hasErrors = hasErrors;
        vm.openUrl = openUrl;
        vm.deleteItem = function (col, index) {
            requestCreationService.deleteItem(col, index);
        };

        // ******************************
        // Promises
        requestCreationService.load($routeParams.uid).then((request) => {
            vm.request = request;
        });
        configService.getApiDescription().then((api) => vm.fields = api.fields);

        // Functions
        function save() {
            requestCreationService.save().then((request) => {
                console.log("Document saved : ", request);
                requestCreationService.load(request.id).then((request) => vm.request = request);
            });
        }

        function run() {
            vm.result = [];
            var callback = (r) => {
                console.log("Result : ", r);
                vm.result = r
            };
            requestRunnerService.run(vm.request).then(callback, callback, callback)
                .then(() => requestCreationService.load($routeParams.uid))
                .then((request) => vm.request = request);
        }

        function openUrl(url) {
            configService.openWebBrowser(url);
        }


        function hasErrors() {
            return vm.result.errors
                && vm.result.errors.length > 0;
        }

    }

})();