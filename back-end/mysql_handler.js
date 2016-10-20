const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 100, //important
  host     : 'localhost',
  user     : 'root',
  password : 'gogogo',
  database : 'node',
  debug    :  false
});

function handler(query, callback) {  
  pool.getConnection(function(err, connection){
    if (err) {
      // res.json({"code" : 100, "status" : "Error in connection database"});
      callback(err, null)
      return;
    }

    console.log('connected as id ' + connection.threadId);
    
    connection.query(query, function(err,rows){
      connection.release();
      callback(err, rows)
      // if(!err) {
      //   res.json(rows);
      // } else {
      //   res.json(err);
      // }
    });

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
