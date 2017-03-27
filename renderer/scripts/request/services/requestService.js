(function () {

    'use strict';

    const uuid = require('uuid');
    const dbRequests = new PouchDB('requests', {cache: false});
    const dbRequestResults = new PouchDB('request.results', {cache: false});

    /** App import definition.*/
    angular.module('app.request').factory('requestService', ['$q', requestService]);

    function requestService($q) {

        var defineUuid = (obj) => Object.assign({_id: uuid.v4()}, obj);
        var all = (param) => $q.when(dbRequests.allDocs(param || {}));
        var get = (uid) => $q.when(dbRequests.get(uid));
        var save = (req) => $q.when(dbRequests.put(defineUuid(req)));

        function saveResult(res) {
            var author = res.author;
            return $q.when(dbRequestResults.put(defineUuid(res))).then((doc) => {
                return {firstname: author.firstname, lastname: author.lastname, count: res.count, authorId: author._id, resultId: doc.id};
            })
        }

        return {
            // all: () => all({include_docs: true}).then((docs) => docs.rows.map((r)=> r.doc).sort((r1,r2) => (r1.name || '').localeCompare(r2.name || ''))),
            all: () => all({include_docs: true}).then((docs) => docs.rows.map((r)=> r.doc)),

            removeAll: () => all({include_docs: true}).then((docs) => $q.all(docs.rows.map((r) => r.doc).map((doc) => $q.when(dbRequests.remove(doc))))),

            count: () => all().then((docs) => docs.total_rows),

            get: get,

            remove: (uid) => $q.when(dbRequests.get(uid)).then((doc) => $q.when(dbRequests.remove(doc))),

            save: save,

            loadResult: (uid) => $q.when(dbRequestResults.get(uid)),

            saveResult: saveResult,
        };
    }
})();
