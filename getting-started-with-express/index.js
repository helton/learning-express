'use strict';

var fs = require('fs');
var _ = require('lodash');
var express = require('express');
var engines = require('consolidate');
var app = express();

var users = [];

fs.readFile('users.json', { encoding: 'utf-8' }, function (err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    users.push(user);
  });
});

app.engine('hbs', engines.handlebars);

app.set('views', './src/views');
app.set('view engine', 'hbs');
//app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', { users: users });
});

app.get(/big.*/, function (req, res, next) {
  console.log('BIG USER ACCESS');
  next();
});

app.get(/.*dog.*/, function (req, res, next) {
  console.log('DOGS GO WOOF');
  next();
});

app.get('/:username', function (req, res) {
  var username = req.params.username;
  res.send(username);
});

var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port);
});
