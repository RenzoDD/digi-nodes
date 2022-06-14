const mysql = require('mysql');

class MySQL {
    static connection = null;
    static Connect() {
        if (MySQL.connection == null)
            MySQL.connection = mysql.createConnection({
                host: 'localhost',
                database: 'diginodes',
                user: 'root',
                password: ''
            });
    }
    static Disconnect() {
        if (MySQL.connection != null) {
            MySQL.connection.end();
            MySQL.connection = null;
        }
    }
    static async Query(query, params) {
        return new Promise((resolve, reject) => {
            if (MySQL.connection == null)
                MySQL.Connect();

            MySQL.connection.query(query, params, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    resolve([]);
                }
                resolve(results[0]);
            });
        });
    }
}

module.exports = MySQL;