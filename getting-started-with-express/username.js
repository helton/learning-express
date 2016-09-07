'use strict';

/*jshint esversion: 6 */

var fs = require('fs');
var express = require('express');
var helpers = require('./helpers');
var User = require('./db').User;

var router = express.Router({
  mergeParams: true
});

router.use(function (req, res, next) {
  console.log(req.method, 'for', req.params.username, 'at', req.path);
  next();
});

router.get('/', /*helpers.verifyUser,*/function (req, res) {
  var username = req.params.username;
  User.findOne({ username: username }, function (err, user) {
    res.render('user', {
      user: user,
      address: user.location
    });
  });
});

/*
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
*/

router.put('/', function (req, res) {
  var username = req.params.username;
  User.findOne({ username: username }, function (err, user) {
    if (err) console.error(err);

    user.name.full = req.body.name;
    user.location = req.body.location;
    user.save(function () {
      return res.end();
    });
  });
});

router.delete('/', function (req, res) {
  var username = req.params.username;
  var fp = helpers.getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

module.exports = router;