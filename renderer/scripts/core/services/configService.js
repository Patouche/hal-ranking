(function () {

    'use strict';

    const storage = require('electron-json-storage');

    /** App import definition.*/
    angular.module('app.core').factory('configService', ['$q', '$http', configService]);

    function configService($q, $http) {

        var saveConf = function (key, value) {
            var defered = $q.defer(), storageKey = 'hal.' + key;
            // console.log("Saving on storage key '" + storageKey + "' :", value);
            storage.set(storageKey, value, (e) => {
                if (e) throw e;
                // console.log("Configuration '" + storageKey + "' has been saved : ", value);
            });
            defered.resolve(value);
            return defered.promise;
        };

        var getConf = function (key) {
            var defered = $q.defer(), storageKey = 'hal.' + key;
            storage.has(storageKey, (e1, exist) => {
                if (e1) throw e1;
                // console.log("Storage with key '" + storageKey + "' exists :", exist);
                if (!exist) defered.resolve({});
                else {
                    storage.get(storageKey, function (e2, data) {
                        if (e2) throw e2;
                        console.log("Retrieve data from key '" + storageKey + "' :", data);
                        defered.resolve(data);
                    });
                }
            });
            return defered.promise;
        };

        var getUserRequestConf = function () {
            return $q.all([getConf("user"), loadConfig("export.json")()])
                .then((arr) => {
                    return Object.assign({portail: {}, parameters: [], filters: [], columns: []}, arr[0], arr[1]);
                });
        };

        var saveRequestUserConf = function (conf) {
            var check = (key) => (v) => v[key] !== undefined && !v[key].match(/^\s*$/)
            conf.parameters = conf.parameters.filter(check('key')).filter(check('value'));
            conf.filters = conf.filters.filter(check('key')).filter(check('value'));
            conf.columns = conf.columns.filter(check('key'));
            return saveConf('user', conf)
        };

        /**
         * Create a function to load a JSON filename in the config folder.
         *
         * @param {string} filename the filename to load.
         * @returns {Function} the generated function
         */
        var loadConfig = function (filename) {
            return function () {
                var defered = $q.defer();
                console.log("Loading config file : ", filename);
                $http.get('config/' + filename).then((res) => defered.resolve(res.data));
                return defered.promise;
            }
        };

        return {

            saveUserPref: (key, value) => getConf('user.prefs')
                .then((obj) => Object.defineProperty(obj || {}, key, {value: value, writable: true, enumerable: true, configurable: true}))
                .then((obj) => saveConf('user.prefs', obj))
                .then((obj) => obj[key]),

            getUserPref: (key, defValue) => getConf('user.prefs').then((json) => (json[key] != undefined) ? json[key] : defValue),

            getRequestUserConf: getUserRequestConf,

            saveRequestUserConf: saveRequestUserConf,

            getExport: loadConfig("export.json"),

            getApiDescription: loadConfig("api-description.json"),

        };
    }
})();
