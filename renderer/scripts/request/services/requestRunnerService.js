(function () {

  'use strict';

  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  const uuid = require('uuid');
  const moment = require('moment');
  const stringify = require('csv-stringify');


  /** App import definition.*/
  angular.module('app.request').factory('requestRunnerService', ['$q', 'authorService', 'requestService', requestRunnerService]);

  function requestRunnerService($q, authorService, requestService) {

    /**
     * Run the API query for a given author and execute all MapReduce to calculate the columns result.
     *
     * @param {Object} author the author
     * @param {Object} request the request to execute
     * @param {integer} timeout the timeout
     * @returns {*|Promise.<TResult>} a promise of result containing the JSON and the columns
     */
    function extractRequest(author, request, timeout) {
      return authorService.getAuthorData(author, request.portail, request.parameters, request.filters, timeout).then((out) => {
        if (out.error) return {error: out.error};
        var cols = [], docs = out.body.docs;
        request.columns.forEach((col) => cols.push({
          key: col.key,
          value: eval(col.reduce)(docs.map(eval(col.map)))
        }));
        return {author: author, url: out.url, count: out.body.numFound, json: out, columns: cols};
      });
    }

    function csvWriteStream(request, suffix) {
      let basename = ['extract', request.name.replace(/[^a-z0-9-]+/gi, '_').toLowerCase()];
      if (suffix !== null) {
        basename.push(suffix);
      }
      basename.push(moment().unix());
      let filename = path.join(os.homedir(), basename.join('-') + '.csv');
      return fs.createWriteStream(filename, {'flags': 'a'});
    }

    function retrieveStringify(csv) {
      let stringifyStream = stringify({delimiter: ';'});
      stringifyStream
        .on('readable', () => {
          var row;
          while (row = stringifyStream.read()) csv.write(row);
        })
        .on('error', (err) => console.log(err.message))
        .on('finish', () => csv.end(''));

      return stringifyStream;
    }

    function csvFlatWriter(authors, request) {
      var csv = csvWriteStream(request, 'flat');
      var stringifyStream = retrieveStringify(csv);

      var authHeader = authors[0].data.map((i) => i.key), colHeader = request.columns.map((i) => i.key);
      stringifyStream.write([].concat(authHeader).concat(colHeader));

      var getData = function (arr) {
        var keys = arr.map((i) => i.key);
        return keys.map((k) => arr.find((i) => i.key == k).value);
      };

      return {
        authors: authors,
        write: (request) => {
          let values = [].concat(getData(request.author.data)).concat(getData(request.columns));
          stringifyStream.write(values);
          return request;
        },
        end: () => stringifyStream.end()
      };
    }

    function csvWriter(authors, request) {
      let csv = csvWriteStream(request);
      let stringifyStream = retrieveStringify(csv);

      let authHeader = authors[0].data.map((i) => i.key), colHeader = request.columns.map((i) => i.key);
      stringifyStream.write([].concat(authHeader).concat(colHeader));

      let getData = function (arr) {
        let keys = arr.map((i) => i.key);
        return keys.map((k) => arr.find((i) => i.key == k).value);
      };

      return {
        authors: authors,
        write: (request) => {
          for (let i = 0; i < request.count; i++) {
            let data = getData(request.columns)
              .map((array) => Array.isArray(array) ? array[i] : 'NA');
            let values = [].concat(getData(request.author.data)).concat(data);
            stringifyStream.write(values);
          }
          return request;
        },
        end: () => stringifyStream.end()
      };
    }

    function writers(authors, writers) {
      return {
        authors: authors,
        write: (request) => {
          writers.forEach(w => w.write(request));
          return request;
        },
        end: () => writers.forEach(w => w.end())
      };
    }

    function internalRunner(request, authors, writer) {
      let defered = $q.defer(), results = [], out = {requestId: request._id, progress: 0, count: authors.length};

      let handleErrors = (method) => (e) => console.log('Error in ' + method + ' :', e) && defered.reject({errors: [e.toString()]});

      let resultCallback = (result) => requestService.saveResult(result).then((res) => {
        results.push(res);
        out.progress++;
        defered.notify(out);
      }, handleErrors('singleResultCallback'));

      // TODO : retrieve the 2000 value from configuration
      let promises = authors.map((author, idx) => $q.when(extractRequest(author, request, idx * 2000))
        .then(writer.write, handleErrors('csvCallback'))
        .then(resultCallback, handleErrors('resultCallback')));

      $q.all(promises)
        .then(() => writer.end())
        .then(() => requestService.save(Object.assign(request, {results: results})), handleErrors('$q.all 1'))
        .then((obj) => defered.resolve(out), handleErrors('$q.all 3'));

      return defered.promise;
    }

    /**
     * Run a new export.
     *
     * @returns {Promise} a promise which will be update when a authors is handle
     */
    const run = function (request) {
      for (let k in request.columns) {
        let col = request.columns[k];
        let keyName = col.key;
        try {
          eval(col.reduce);
          eval(col.map);
        } catch (e) {
          console.log('Error : ', e);
          return $q.reject({errors: ['Error in column \'' + keyName + '\' due to ' + e.toString()]});
        }
      }


      return authorService.getAuthors()
        .then((authors) => writers(authors, [csvFlatWriter(authors, request), csvWriter(authors, request)]))
        .then((exec) => internalRunner(request, exec.authors, exec));
    };

    return {
      run: run
    };
  }
})();
