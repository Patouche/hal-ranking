(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.request').controller('RequestDetailsController', ['$routeParams', '$location', 'requestService', 'requestRunnerService', 'systemService', RequestDetailsController]);

    function RequestDetailsController($routeParams, $location, requestService, requestRunnerService, systemService) {
        var vm = this;

        // Variables
        vm.request = {};
        vm.result = undefined;
        vm.deleteRequest = deleteRequest;
        vm.openResult = openResult;
        vm.run = run;
        vm.openWebBrowser = (url) => systemService.openWebBrowser(url);


        // Promises
        requestService.get($routeParams.uid).then((request) => vm.request = request);

        // Functions
        function deleteRequest() {
            console.log("Try to delete export by its uid :", $routeParams.uid);
            requestService.remove($routeParams.uid).then((r) => $location.path('/requests'), (e) => console.log(e));
        }

        function openResult(index) {
            var res = vm.request.results[index];
            requestService.loadResult(res.resultId).then((r) => {
                console.log("Result :", r);
                vm.result = r;
            });
        }

        function run() {
            vm.result = undefined;
            var callback = (r) => {
                console.log("Result progress :", r);
            };
            return requestRunnerService.run(vm.request).then(callback, callback, callback)
                .then(() => requestService.get($routeParams.uid))
                .then((request) => vm.request = request);
        }

    }

})();