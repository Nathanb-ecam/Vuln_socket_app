var mysql=require('mysql');
var secrets = require('./db_credentials.json')


var connection=mysql.createConnection({
    host:secrets.host,
    user:secrets.user,
    password:secrets.password,
    database:secrets.db
});

connection.connect(function(error){if(error)console.log(error)});


module.exports = connection;