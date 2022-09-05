const express = require('express');
const users = express.Router();
const cors = require('cors');
users.use(cors());
const jwt = require('jsonwebtoken');
const ExpressBrute = require('express-brute');
const service = require('../services/users.service')
const store = new ExpressBrute.MemoryStore();

const failCallback = function (req, res, next, nextValidRequestDate) {
    res.redirect('/');
};

/**
 * CONTROLA NÚMERO DE REQUISIÇÕES POR USUÁRIO
 */
const userBruteforce = new ExpressBrute(store, {
    freeRetries: 10,
    minWait: 5 * 60 * 1000,
    maxWait: 60 * 60 * 1000,
    failCallback: failCallback
})

/**
 * CONTROLA NÚMERO DE REQUISIÇÕES
 */
const globalBruteforce = new ExpressBrute(store, {
   freeRetries: 200,
   attachResetToRequest: false,
   refreshTimeoutOnRequest: false,
   minWait: 25 * 60 * 60 * 1000,
   maxWait: 25 * 60 * 60 * 1000,
   lifetime: 24 * 60 * 60,
   failCallback: failCallback
});

users.get('/getAll', async function (req, res) {
   service.getAll()
      .then(data => { res.status(200).json(data) })
      .catch(err => { res.status(400).json(err) });
});
users.get('/getUser', async function (req, res) {
   userService.getUser(req.params._id)
      .then(data => { res.status(200).json(data) })
      .catch(err => { res.status(400).json(err) });
});
users.post('/add', async function (req, res) {
   userService.add(req.body)
      .then(data => { res.status(200).json(data) })
      .catch(err => { res.status(400).json(err) });
});

users.delete('/delete', async function (req, res) {
   userService.delete(req.params._id)
      .then(data => { res.status(200).json(data) })
      .catch(err => { res.status(400).json(err) });
});
users.put('/update', async function (req, res) {
   userService.update(req.body)
      .then(data => { res.status(200).json(data) })
      .catch(err => { res.status(400).json(err) });
});

module.exports = users;
