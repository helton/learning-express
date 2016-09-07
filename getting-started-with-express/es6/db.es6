/*jshint esversion: 6 */

let uri = 'mongodb://localhost:27017/test';

let MongoClient = require('mongodb').MongoClient;

let findUsers = (db, callback) => {
  let cursor = db.collection('users').find();
  cursor.each((err, doc) => {
    if (doc !== null) {
      console.dir(doc);
    } else {
      callback();
    }
  });
};

MongoClient.connect(uri, (err, db) => {
  findUsers(db, () => db.close());
});
