(function () {

    'use strict';

    const fs = require('fs');
    const crypto = require('crypto');
    const parse = require("csv-parse");
    const uuid = require("uuid");
    const stream = require("stream");
    const request = require('request');
    const hash = crypto.createHash('sha256');
    const dbAuthors = new PouchDB('authors');


    /** App import definition.*/
    angular.module('app.author').factory('authorService', ['$q', '$timeout', 'configService', authorService]);

    function authorService($q, $timeout, configService) {


        /**
         * Author comparator.
         *
         * @param {Object} auth1 the first author
         * @param {Object} auth2 the second author
         */
        var authorComparator = (auth1, auth2) => auth1.lastname.localeCompare(auth2.lastname);

        /**
         * Load all authors.
         * @param param
         */
        var all = (param) => $q.when(dbAuthors.allDocs(param || {}));

        /**
         * Digest data.
         * @param {string|Array} data the data to hash
         * @returns {string} the hash ot the data
         */
        var digest = (data) => {
            var d = (typeof data == 'object' && data.constructor.name == 'Array') ? data.join('/') : data;
            if (typeof d != 'string') throw Error("Cannot hash data of type : " + (typeof d));
            var hash = crypto.createHash('sha256');
            hash.update(d);
            return hash.digest('hex');
        };

        /**
         * Import CSV file.
         *
         * @param csvFilename the filename of the csv
         * @param delimiter the delimiter between fields
         * @param headers the csv header
         * @param firstname the firstname index
         * @param lastname the lastname index
         * @returns {*}
         */
        function importCsv(csvFilename, delimiter, headers, firstname, lastname) {
            console.log("Read content of import files : %s (firstname : %s, lastname : %s)", csvFilename, firstname, lastname);
            var defered = $q.defer(), parser = parse({delimiter: delimiter || ';'});

            var out = {progress: 0, authors: [], errors: []};

            fs.createReadStream(csvFilename).pipe(parser)
                .on('data', (data) => {
                    if (out.progress > 0) {
                        var author = {
                            _id: uuid.v4(),
                            firstname: data[firstname],
                            lastname: data[lastname],
                            data: data.map((value, index) => Object.assign({}, {
                                key: headers[index],
                                value: value
                            })),
                            requestCache: []
                        };
                        dbAuthors.put(author);
                        defered.notify(out);
                    }
                    out.progress += 1;
                })
                .on('error', (e) => {
                    out.errors.push(e.toString());
                    defered.reject(out);
                })
                .on('finish', (e) => {
                    if (e) out.errors.push(e.toString());
                    out.lines = parser.lines;
                    defered.resolve(out);
                });


            return defered.promise;
        }

        /**
         * Retrieve data.
         *
         * @param {string} authorUid
         * @param {string} url
         * @param {integer} timeout
         * @returns {*|Promise.<TResult>}
         */
        function retrieveData(authorUid, url, timeout) {
            var temporizer = (author, hash, until) => {
                console.log("No result found in author#results section => Loading data from HAL");
                var def = $q.defer();
                var req = () => request(url, function (error, response, body) {
                    var json = JSON.parse(body);
                    var data = {
                        error: (json.error && json.error.msg) || error,
                        code: (json.error && json.error.code) || response.statusCode,
                        body: json.response
                    };
                    console.log("HAL return response (%d) at %s", data.code, new Date());
                    author.requestCache.push({key: hash, value: data});
                    $q.when(dbAuthors.put(author)).then(() => def.resolve(data), (e) => def.reject(e.toString()));
                });
                $timeout(req, until);
                return def.promise;
            };

            return $q.when(dbAuthors.get(authorUid)).then((author) => {
                var requestCache = (author.requestCache || []), hash = digest(url);
                var cache = requestCache.find((r) => r.key == hash);
                var value = cache && cache.value;
                console.log("Author with id %s found data for current request : %s", authorUid, value != null);
                return value || temporizer(author, hash, timeout || 0);
            });
        }

        /**
         * Load data about a author.
         *
         * @param author the author
         * @param portail the portail.
         * @param parameters the parameters.
         * @param filters the filters.
         * @returns {Promise} a promise of response
         */
        function loadAuthorData(author, portail, parameters, filters, timeout) {
            return configService.getApiDescription().then((api) => {
                var fields = api.fields.filter((f) => f.stored);

                console.log("Try to retrieve information on HAL for author : ", author);

                var authorFilters = [
                    {key: 'authFullName_t', value: author.lastname},
                    {key: 'authFirstName_t', value: author.firstname}
                ].concat(filters);
                var url = portail + '?'
                    + parameters.map((o) => o.key + '=' + encodeURI(o.value)).sort().join('&')
                    + '&fl=' + fields.filter((f) => f.stored).map((f)=> f.key).join(',')
                    + '&fq=' + authorFilters.map((o) => o.key + ':' + encodeURI(o.value)).sort().join(' AND ');

                console.log("Author : '" + author.firstname + " " + author.lastname + "' url : ", url);

                return retrieveData(author._id, url, timeout).then((obj) => Object.assign({url: url}, obj));
            })
        }

        /**
         * Clear cache.
         *
         * @returns {*|Promise.<TResult>}
         */
        function clearCache() {
            var callback = (doc) => $q.when(dbAuthors.get(doc.id)).then((author) => dbAuthors.put(Object.assign(author, {requestCache: []})));
            return all().then((docs) => $q.all(docs.rows.map(callback)));
        }

        return {
            importCsv: importCsv,

            getAuthorData: loadAuthorData,

            getAuthors: () => all({include_docs: true}).then((data) => data.rows.map((d) => d.doc).sort(authorComparator)),

            getAuthor: (uid) => $q.when(dbAuthors.get(uid)),

            dropAll: () => all({include_docs: true}).then((docs) => $q.all(docs.rows.map((r) => r.doc).map((doc) => $q.when(dbAuthors.remove(doc))))),

            clearCache: clearCache,

        };
    }
})();
