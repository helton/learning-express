/*jshint esversion: 6 */

const fs = require('fs');
const express = require('express');
const helpers = require('./helpers');
const User = require('./db').User;

const router = express.Router({
  mergeParams: true
});

router.use((req, res, next) => {
  console.log(req.method, 'for', req.params.username, 'at', req.path);
  next();
});

router.get('/', /*helpers.verifyUser,*/ (req, res) => {
  let username = req.params.username;
  User.findOne({ username: username }, (err, user) => {
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

router.put('/', (req, res) => {
  let username = req.params.username;
  User.findOne({ username: username}, (err, user) => {
    if (err) console.error(err);

    user.name.full = req.body.name;
    user.location = req.body.location;
    user.save(() => res.end());
  });
});

router.delete('/', (req, res) => {
  let username = req.params.username;
  let fp = helpers.getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

module.exports = router;
