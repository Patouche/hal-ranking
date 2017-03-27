(function () {

    'use strict';

    var parse = require("csv-parse");
    var fs = require('fs');
    var transform = require('stream-transform');


    /** App import definition.*/
    angular.module('app.author').factory('authorImportService', ['$q', authorImportService]);

    /**
     * Class constructor.
     *
     * @param $q
     * @constructor
     */
    function authorImportService($q) {
        return {

            csvNumberRows: function (csvFilename, delimiter) {
                var defered = $q.defer(), parser = parse({delimiter: ';'}), count = 0;
                fs.createReadStream(csvFilename).pipe(parser)
                    .on('data', (d) => count++)
                    .on('error', (e) => defered.reject('Error : ' + e))
                    .on('end', () => defered.resolve(count));
                return defered.promise;
            },

            getHeaders: function (csvFilename, delimiter) {
                var defered = $q.defer(), parser = parse({delimiter: delimiter || ';'});
                console.log("Get headers for import file " + csvFilename);

                fs.createReadStream(csvFilename).pipe(parser)
                    .on('data', (data) => {
                        defered.resolve(data);
                        stream.destroy();
                    })
                    .on('error', (e) => defered.reject('Error : ' + e))
                    .on('end', () => defered.reject('File end reached without finding line'));
                return defered.promise;
            }

        };
    }
})();
