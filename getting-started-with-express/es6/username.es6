/*jshint esversion: 6 */

const fs = require('fs');
const express = require('express');
const helpers = require('./helpers');

const router = express.Router({
  mergeParams: true
});

router.use((req, res, next) => {
    console.log(req.method, 'for', req.params.username, 'at', req.path);
    next();
});

router.get('/', /*helpers.verifyUser,*/ (req, res) => {
    let username = req.params.username;
    let user = helpers.getUser(username);
    res.render('user', {
        user: user,
        address: user.location
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
    let user = helpers.getUser(username);
    user.location = req.body;
    helpers.saveUser(username, user);
    res.end();
});

router.delete('/', (req, res) => {
    let username = req.params.username;
    let fp = helpers.getUserFilePath(username);
    fs.unlinkSync(fp); // delete the file
    res.sendStatus(200);
});

module.exports = router;
