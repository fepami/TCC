const moment = require('moment');
moment.locale('pt-br');

const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit : 100, //important
	host     : 'localhost',
	user     : 'root',
	password : 'ehissoae',
	database : 'eleitor',
	debug    :  false,
	charset	 : 'utf8'
});

// INSERT INTO politician VALUES (1,'Felipe','1993-04-05', 'TCC')
// INSERT INTO politician VALUES (2,'Yay','1999-04-05', 'TCC')

function handler(query, params_or_callback, callback) {
	pool.getConnection(function(err, connection){
		if (err) {
			callback(err, null)
			return;
		}

		console.log(moment().format('DD/MM/YY h:mm:ss') + ': connected as id ' + connection.threadId);

		if (typeof callback === "undefined") {
			var yay = connection.query(query, function(err,rows){
				if (err) {
					console.log('*** MYSQL ERROR ***');
					console.log(yay.sql.replace(/\t/g, '\n'));
					console.log('*** MYSQL ERROR ***');
				}

				connection.release();
				// console.log('*** DEBUG ***');
				// console.log(yay.sql.replace(/\t/g, '\n'));
				// console.log('*** DEBUG ***');
				params_or_callback(err, rows)
			});
		} else {
			var yay = connection.query(query, params_or_callback, function(err,rows){
				if (err) {
					console.log('*** MYSQL ERROR ***');
					console.log(yay.sql.replace(/\t/g, '\n'));
					console.log('*** MYSQL ERROR ***');
				}

				connection.release();
				// console.log('*** DEBUG ***');
				// console.log(yay.sql.replace(/\t/g, '\n'));
				// console.log('*** DEBUG ***');
				callback(err, rows)
			});
		}

		connection.on('error', function(err) {
			callback(err, null)
			return;
		});
	});
}

handler('select 1', function(err){
	if (err) {
		console.log(err);
	} else {
		console.log('MySql loaded!');
	}
});

module.exports = {
	'handler': handler
}
