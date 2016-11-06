const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 100, //important
  host     : 'localhost',
  user     : 'root',
  password : 'ehissoae',
  database : 'eleitor',
  debug    :  false
});

// INSERT INTO politician VALUES (1,'Felipe','1993-04-05', 'TCC')
// INSERT INTO politician VALUES (2,'Yay','1999-04-05', 'TCC')

function handler(query, params_or_callback, callback) {
  pool.getConnection(function(err, connection){
    if (err) {
      // res.json({"code" : 100, "status" : "Error in connection database"});
      callback(err, null)
      return;
    }

    console.log('connected as id ' + connection.threadId);

    if (typeof callback === "undefined") {
      connection.query(query, function(err,rows){
        connection.release();
        params_or_callback(err, rows)
        // if(!err) {
        //   res.json(rows);
        // } else {
        //   res.json(err);
        // }
      });
    } else {
      connection.query(query, params_or_callback, function(err,rows){
        connection.release();
        callback(err, rows)
        // if(!err) {
        //   res.json(rows);
        // } else {
        //   res.json(err);
        // }
      });
    }



    connection.on('error', function(err) {
      // res.json({"code" : 100, "status" : "Error in connection database"});
      callback(err, null)
      return;
    });
  });
}

module.exports = {
  'handler': handler
}
