const { Client } = require('pg');
const { postgre } = require("../db/database");

module.exports = {
    login: function (params) {
        const client = new Client(postgre)
        return new Promise((resolve, reject) => {
            if(params.user && params.pass) {
                client.connect(function (err) {
                    if (err) reject(err);
                    client.query(`SELECT * from user_access where username = '${params.user}' and user_password = '${params.pass}'`, (err, res) => {
                        client.end()
                        if (err) reject(err);
                        else {
                            if (res.rows.length == 1) {
                                resolve(res.rows[0]);
                            } else {
                                reject("Usuário ou senha incorreta.")
                            }
                        }
                    })
                });
            } else {
                reject("Usuário ou senha incorreta.")
            }
        })
    },
}