/*jshint esversion: 6 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const helpers = require('./helpers');

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
    let users = [];
    fs.readdir('users', (err, files) => {
        files.forEach(file => {
            fs.readFile(path.join(__dirname, 'users', file), {
                encoding: 'utf8'
            }, (err, data) => {
                let user = JSON.parse(data);
                user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
                users.push(user);
                if (users.length === files.length)
                    res.render('index', {
                        users: users
                    });
            });
        });
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
    var username = req.params.username;
    var user = helpers.getUser(username);
    res.json(user);
});

const userRouter = require('./username');
app.use('/:username', userRouter);

const server = app.listen(3000, () => {
    console.log('Server running at http://localhost:' + server.address().port);
});
