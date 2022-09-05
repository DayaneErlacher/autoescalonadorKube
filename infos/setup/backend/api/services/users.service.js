const { Client } = require('pg');
const { postgre } = require("../db/database");
module.exports = {
    getAll: function () {
        const client = new Client(postgre)
        return new Promise((resolve, reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                client.query('SELECT * FROM users ORDER BY id', (err, res) => {
                    if (err) reject(err);
                    client.end()
                    resolve(res.rows);
                })
            });
        })
    },
    getUser: function(id) {
        const client = new Client(postgre)
        return new Promise((resolve, reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                client.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
                    if (err) reject(err);
                    client.end()
                    resolve(res.rows[0]);
                })
            });
        })
    },
    add: function (user){
        const client = new Client(postgre)
        return new Promise((resolve, reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                client.query(`INSERT INTO users(username, user_password, age, address, cpf) 
                VALUES('${user.username}', '${user.user_password}',  ${user.age}, '${user.address}', '${user.cpf}')`, (err, res) => {
                    if (err) reject(err);
                    client.end()
                    resolve(true);
                })
            });
        })
    },
    delete: function(id) {
        const client = new Client(postgre)
        return new Promise((resolve, reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                client.query(`DELETE FROM users WHERE id = ${id}`, (err, res) => {
                    if (err) reject(err);
                    client.end()
                    resolve(true);
                })
            });
        })
    }, 
    update: function (user){
        const client = new Client(postgre)
        return new Promise((resolve, reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                client.query(`UPDATE users SET username = '${user.username}', user_password = '${user.user_password}', age = ${user.age}, address = '${user.address}', cpf = '${user.cpf}' WHERE id = ${user.id}`, (err, res) => {
                    if (err) reject(err);
                    client.end()
                    resolve(true);
                })
            });
        })
    },
   
}