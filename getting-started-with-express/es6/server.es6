/*jshint esversion: 6 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const JSONStream = require('JSONStream');

const User = require('./db').User;

const app = express();

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profile-pics', express.static('images'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.render('index', { users: users });
  });
});

app.get('/error/:username', (req, res) => {
  res.status(404)
      .send('No user name ' + req.params.username + ' found');
});

app.get('*.json', (req, res) => {
  res.download('./users/' + req.path, 'data.json');
});

app.get('/data/:username', (req, res) => {
  let username = req.params.username;
  let readable = fs.createReadStream('./users/' + username + '.json');
  readable.pipe(res);
});

app.get('/users/by/:gender', (req, res) => {
  let gender = req.params.gender;
  let readable = fs.createReadStream('users.json');

  readable
    .pipe(JSONStream.parse('*', user => {
      if (user.gender === gender)
        return user.name;
    }))
    .pipe(JSONStream.stringify('[\n  ', '\,\n  ', '\n]\n'))
    .pipe(res);
});

const userRouter = require('./username');
app.use('/:username', userRouter);

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
