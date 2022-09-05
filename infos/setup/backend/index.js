const config = require('config');
// FRAMEWORK PARA GERENCIAR REQUISIÇÕES HTTP
const express = require("express");
const app = express();
// SESSION MIDDLEWARE
// Os dados da sessão não são salvos no próprio cookie, apenas o ID da sessão. Os dados da sessão são armazenados no lado do servidor.
const session = require("express-session");
// Este módulo fornece middleware Express para validar JWTs (JSON Web Tokens) através do módulo jsonwebtoken
const { expressjwt: jwt } = require("express-jwt");
// MIDDLEWARE TO ENABLE CORS
const cors = require('cors');
// BODY PARSING MIDDLEWARE
const bodyParser = require("body-parser");
// MIDDLEWARE TO GZIP API RESPONSES 
const compression = require('compression');
// MIDDLEWARE TO SECURE EXPRESS
// ajuda a proteger cabeçalhos HTTP retornados por seus aplicativos Express
const helmet = require('helmet')
// MIDDLEWARE TO LIMIT REPEATED REQUESTS TO API
const rateLimit = require("express-rate-limit");
// PROMETHEUS PARA CONTAGEM DE ACESSOS
const Prometheus = require('prom-client');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.use(helmet())
process.env.SECRET_KEY = 'PGUFES2022';

// DEFINE LIMITED NUMBER OF REQUESTS TO API
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const httpRequestsCounter = new Prometheus.Counter({
    name: "http_requests",
    help: "number of http requests",
})

app.use(limiter);
app.use(compression());

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.use(
    session({
        secret: config.secret,
        resave: true,
        saveUninitialized: false,
    })
);

app.use(
    "/api",
    jwt({
        secret: process.env.SECRET_KEY,
        credentialsRequired: true,
        algorithms: ["HS256"]
    })
);

/**
 * CHECK JWT TOKEN TO ALLOW ACCESS TO API PATH
 * @param {string} err - ERROR
 */
const jwtToken = require('jsonwebtoken');
app.use(function (err, req, res, next) {
    // MÉTRICAS
    httpRequestsCounter.inc();
    var token = req.session.token;
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    jwtToken.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });


        next();
    });
});

app.use("/api/users", require("./api/controllers/users.controller"));
app.use("/auth", require("./api/controllers/login.controller"));

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType)
    res.end(await Prometheus.register.metrics())
})

// app.get("/", function (req, res) {
//     return res.redirect("/app");
// });

const minify = require('express-minify');
const minifyHTML = require('express-minify-html');

// MINIFICATION
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));
// CACHE
app.use(minify({
    cache: './cache',
}))

// DETERMINED PORT OF THE SERVER
const port = process.env.port || config.port;

/**
* STARTS NODEJS SERVER
* @param {string} port - RUNNING PORT OF NODEJS SERVER
*/
const server = app.listen(port, function () {
    console.log("Server listening at http://" +
        server.address().address +
        ":" +
        server.address().port);
});


