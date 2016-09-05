const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const app = express();

let users = [];

fs.readFile('users.json', {encoding: 'utf-8'}, (err, data) => {
  if (err) throw err;

  JSON.parse(data).forEach(user => {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    users.push(user);
  });
})

app.get('/', (req, res) => {
  var buffer = '';
  users.forEach(user => {
    buffer += '<a href="/' + user.username + '">' + user.name.full + '</a> <br />';
  });
  res.send(buffer);
});

app.get(/big.*/, (req, res, next) => {
  console.log('BIG USER ACCESS');
  next();
});

app.get(/.*dog.*/, (req, res, next) => {
  console.log('DOGS GO WOOF');
  next();
});

app.get('/:username', (req, res) => {
  var username = req.params.username;
  res.send(username);
});

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
