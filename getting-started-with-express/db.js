'use strict';

/*jshint esversion: 6 */

var uri = 'mongodb://localhost:27017/test';

var MongoClient = require('mongodb').MongoClient;

var findUsers = function findUsers(db, callback) {
  var cursor = db.collection('users').find();
  cursor.each(function (err, doc) {
    if (doc !== null) {
      console.dir(doc);
    } else {
      callback();
    }
  });
};

MongoClient.connect(uri, function (err, db) {
  findUsers(db, function () {
    return db.close();
  });
});