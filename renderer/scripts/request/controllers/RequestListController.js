(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.request').controller('RequestListController', ['$location', 'requestService', 'requestCreationService', RequestListController]);

    function RequestListController($location, requestService, requestCreationService) {
        var vm = this;

        // Variables
        vm.requests = undefined;
        vm.createNew = createNew;
        vm.cleanDatabase = cleanDatabase;

        // Promises
        requestService.all().then((requests) => vm.requests = requests, (e) => {
            console.log('Error :', e);
            vm.requests = []
        });

        // Functions
        function createNew() {
            requestCreationService.create().then((uid) => {
                $location.path("/requests/" + uid + '/edit')
            }, (e) => console.log("Error : ", e));
        }

        function cleanDatabase() {
            requestService.removeAll().then((requests) => vm.requests = requests);
        }

    }

})();