const express = require('express');
const auth = express.Router();
const cors = require('cors');
auth.use(cors());
const jwt = require('jsonwebtoken');
const ExpressBrute = require('express-brute');
const service = require('../services/login.service')
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


/**
 * CONTROLLER PARA VALIDAR AUTENTICAÇÃO DO USUÁRIO, CRIA SESSÃO E PREVINI BRUTE FORCE
 */
auth.post('/login', globalBruteforce.prevent,
    userBruteforce.getMiddleware({
        key: function (req, res, next) {
            next(req.body.email);
        }
    }), async function (req, res) {
        var appData = {};
        service.login(req.body)
            .then(data => {
                req.brute.reset(function () {
                    var token = jwt.sign({
                        id: data.id
                    }, process.env.SECRET_KEY, {
                        expiresIn: '24h'
                    });
                    req.session.token = token;
                    appData.user = data.username;
                    appData['token'] = token;
                    res.status(200).json(appData)
                })
            })
            .catch(err => { res.status(401).json(err) });
    })

module.exports = auth;