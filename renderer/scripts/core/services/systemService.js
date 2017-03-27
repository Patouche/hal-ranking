(function () {

    'use strict';

    const electron = require('electron');

    /** App import definition.*/
    angular.module('app.core').factory('systemService', ['$q', systemService]);

    function systemService($q) {

        /**
         * Open a web browser.
         * @param url
         */
        var openWebBrowser = function (url) {
            console.log('Open external web brower on url : ', url);
            var {shell} = electron;
            shell.openExternal(url);
        };

        return {

            openWebBrowser: openWebBrowser,

        };
    }
})();
