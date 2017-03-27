(function () {

    'use strict';

    const uuid = require('uuid');

    /** App import definition.*/
    angular.module('app.request').factory('requestCreationService', ['$q', 'authorService', 'configService', 'requestService', requestCreationService]);

    function requestCreationService($q, authorService, configService, requestService) {

        /** Export configuration. */
        var request = newRequestConfig();

        /**
         * Create a new export configuration.
         *
         * @returns {JSON}
         */
        function newRequestConfig() {
            var uid = uuid.v4();
            console.log("Instanciate a new request with uid :", uid);
            return {
                _id: uid,
                name: "Request",
                state: false,
                date: undefined,
                portail: "",
                parameters: [],
                columns: [],
                filters: [],
                results: []
            };
        }

        /**
         * Init function for creating a new export.
         *
         * @returns {Promise} a promise for create a new export.
         */
        var create = function () {
            console.log("Create a new request ...");
            return configService.getRequestUserConf()
                .then((conf) => Object.assign({}, newRequestConfig(), conf))
                .then((req) => requestService.count().then((size) => Object.assign(req, {name: req.name + ' ' + (size + 1)})))
                .then((req) => requestService.save(req))
                .then((doc) => doc.id);
        };

        /**
         * Load a export by its uid.
         *
         * @param {string} uid the export uid
         * @returns {Promise} a promise of export configuration
         */
        var load = function (uid) {
            console.log("Load request with uid :", uid);
            return requestService.get(uid).then((exp) => request = exp);
        };

        /**
         * Add a item in one of the given array of the configExport.
         *
         * @param {string} key the key to identify the array in the configExport object
         * @param {Object} prototype the default object to add in the array.
         * @returns {Function} a new instance of a function to add a idem
         */
        var add = function (key, prototype) {
            return () => {
                console.log("Add %s on request with default type : %o", key, prototype);
                request[key].push(Object.assign({}, prototype));
                return request[key];
            };
        };

        /**
         * Delete a item from the request config.
         *
         * @param {string} key the key of the request config object where the item should be deleted
         * @param {integer} index the index in the array to remove
         */
        var deleteItem = function (key, index) {
            console.log("Delete item in array '%s' at index : %d", key, index);
            request[key].splice(index, 1);
        };

        return {
            create: create,
            load: load,
            deleteItem: deleteItem,
            addColumn: add("columns", {key: "", map: "", reduce: ""}),
            addFilter: add("filters", {key: "", value: ""}),
            save: () => requestService.save(request),
        };
    }
})();
