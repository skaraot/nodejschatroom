var db = require('mysql');

    var connection = db.createConnection({
        host : '',
        port : 3306,
        user : '',
        password : '',
        database : ''
    });

    connection.connect(function(error){
        if(!!error)
        {
            console.log(error);
            console.log('Connection Error');
        }
        else
        {
            console.log('DB to Connected');
        }
    });

module.exports = connection;