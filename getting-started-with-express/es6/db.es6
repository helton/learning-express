/*jshint esversion: 6 */
const _ = require('lodash');
const mongoose = require('mongoose');

let uri = 'mongodb://localhost:27017/test';
mongoose.connect(uri);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', callback => console.log('db connected'));

let userSchema = mongoose.Schema({
  username: String,
  gender: String,
  name: {
    title: String,
    first: String,
    last: String
  },
  location: {
    street: String,
    city: String,
    state: String,
    zip: Number
  }
});

userSchema.virtual('name.full').get(function() {
  return _.startCase(this.name.first + ' ' + this.name.last);
});

userSchema.virtual('name.full').set(function(value) {
  let bits = value.split(' ');
  this.name.first = bits[0];
  this.name.last = bits[1];
});

exports.User = mongoose.model('User', userSchema);
