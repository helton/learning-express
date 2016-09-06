const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');

const app = express();

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json';
}

function getUser (username) {
  let user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach(key => {
    user.location[key] = _.startCase(user.location[key]);
  });
  return user;
}

function saveUser (username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profile-pics', express.static('images'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  let users = [];
  fs.readdir('users', (err, files) => {
    files.forEach(file => {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, (err, data) => {
        let user = JSON.parse(data);
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
        if (users.length === files.length)
          res.render('index', { users: users });
      });
    });
  });
});

function verifyUser (req, res, next) {
  let username = req.params.username;
  let fp = getUserFilePath(username);
  fs.exists(fp, yes => {
    if (yes) {
      next();
    } else {
      res.redirect('/error/' + req.params.username);
    }
  });
}

app.get('/error/:username', (req, res) => {
  res.status(404)
     .send('No user name ' + req.params.username + ' found');
})

app.get('*.json', (req, res) => {
  res.download('./users/' + req.path, 'data.json');
});

app.get('/data/:username', (req, res) => {
  var username = req.params.username;
  var user = getUser(username);
  res.json(user);
});

app.all('/:username', (req, res, next) => {
  console.log(req.method, 'for', req.params.username);
  next();
});

app.get('/:username', verifyUser, (req, res) => {
  let username = req.params.username;
  let user = getUser(username);
  res.render('user', {
    user: user,
    address: user.location
  });
});

app.put('/:username', (req, res) => {
  let username = req.params.username;
  let user = getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end();
});

app.delete('/:username', (req, res) => {
  let username = req.params.username;
  let fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
