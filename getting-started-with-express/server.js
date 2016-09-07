'use strict';

/*jshint esversion: 6 */

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var express = require('express');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var JSONStream = require('JSONStream');

var User = require('./db').User;

var app = express();

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profile-pics', express.static('images'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
});

app.get('/', function (req, res) {
  User.find({}, function (err, users) {
    res.render('index', { users: users });
  });
});

app.get('/error/:username', function (req, res) {
  res.status(404).send('No user name ' + req.params.username + ' found');
});

app.get('*.json', function (req, res) {
  res.download('./users/' + req.path, 'data.json');
});

app.get('/data/:username', function (req, res) {
  var username = req.params.username;
  var readable = fs.createReadStream('./users/' + username + '.json');
  readable.pipe(res);
});

app.get('/users/by/:gender', function (req, res) {
  var gender = req.params.gender;
  var readable = fs.createReadStream('users.json');

  readable.pipe(JSONStream.parse('*', function (user) {
    if (user.gender === gender) return user.name;
  })).pipe(JSONStream.stringify('[\n  ', '\,\n  ', '\n]\n')).pipe(res);
});

var userRouter = require('./username');
app.use('/:username', userRouter);

var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port);
});