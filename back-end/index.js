const express = require("express");
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const cassandra_client = require("./cassandra_handler").client

// INSERT INTO politician VALUES (1,'Felipe','1993-04-05', 'TCC');
// INSERT INTO politician VALUES (2,'Yay','1999-04-05', 'TCC');

// INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,1,true);
// INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,1,true);
// INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,1,false);

// INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (4,2,false);
// INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (5,2,true);

// INSERT INTO user VALUES (1,'device_id1');
// INSERT INTO user VALUES (2,'device_id2');
// INSERT INTO user VALUES (3,'device_id3');
// INSERT INTO user VALUES (4,'device_id4');
// INSERT INTO user VALUES (5,'device_id5');


// que complicado
// select * from politician_vote where politician_id=1 and is_positive in (true, false) and user_id=1;

// select count(is_positive) from politician_vote where politician_id=1 and is_positive = True;
// select count(is_positive) from politician_vote where politician_id=1 and is_positive = False;


// queries pra full mysql
// INSERT INTO politician_vote VALUES (1,1,1,true);
// INSERT INTO politician_vote VALUES (2,2,1,true);
// INSERT INTO politician_vote VALUES (3,3,1,false);

// INSERT INTO politician_vote VALUES (4,4,2,false);
// INSERT INTO politician_vote VALUES (5,5,2,true);

app.get("/",(req,res) => {
	if ('database' in req.query && 'execute_query' in req.query) {
		var query_handler = null;
		if (req.query['database'] == 'mysql') {
			query_handler = mysql_handler;
		}
		if (req.query['database'] == 'cassandra') {
			query_handler = cassandra_handler;
		}

		query_handler(req.query['execute_query'], function(err, result){
			if (err) {
				res.json(err);
			}
			res.json(result);
		});
	}
});

// app.get("/lista_politicos",(req,res) => {
// 	mysql_handler('select * from politician', function(err, politicians){
// 		if (err) {
// 			res.json(err);
// 		} else {
// 			function get_age_from_birthday(dateString) {
// 				var today = new Date();
// 				var birthDate = new Date(dateString);
// 				var age = today.getFullYear() - birthDate.getFullYear();
// 				var m = today.getMonth() - birthDate.getMonth();
// 				if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// 					age--;
// 				}
// 				return age;
// 			}
// 			var parsed_politicians = [];
// 			var parsed_politicians_hash = {};
// 			var poli_ids = [];
// 			for (var i = 0; i < politicians.length; i++) {
// 				var poli = politicians[i];

// 				var parsed_poli = {
// 					'politician_id': poli['id'],
// 					'ranking': poli['id'], // faaaake
// 					'nome': poli['name'],
// 					'idade': get_age_from_birthday(poli['date_of_birth']) + ' anos',
// 					'partido': poli['party'],
// 					'approval': 0
// 				}

// 				// parsed_politicians_hash[poli['id']] = parsed_poli;

// 				parsed_politicians.push(parsed_poli);

// 				poli_ids.push(poli['id']);
// 			}

// 			var votes_query = 'select group_and_count(politician_id) as group from politician_vote where politician_id IN '
// 			votes_query += '(' + poli_ids.join(', ') + ')';
// 			votes_query += ' and is_positive=';

// 			cassandra_handler(votes_query + 'true', function(err1, pos_votes){
// 				cassandra_handler(votes_query + 'false', function(err2, neg_votes){
// 					if (err1) {res.json(err1);}
// 					if (err2) {res.json(err2);}

// 					pos_votes = pos_votes[0]['group']
// 					neg_votes = neg_votes[0]['group']


// 					for (var i = 0; i < parsed_politicians.length; i++) {
// 						var parsed_poli = parsed_politicians[i];

// 						var pos = 0
// 						if (parsed_poli['politician_id'] in pos_votes) {
// 							pos = pos_votes[parsed_poli['politician_id']];
// 						}
// 						var neg = 0
// 						if (parsed_poli['politician_id'] in neg_votes) {
// 							neg = neg_votes[parsed_poli['politician_id']];
// 						}

// 						if (pos+neg==0) {
// 							parsed_poli['approval'] = 'yay';
// 						} else {
// 							parsed_poli['approval'] = pos/(pos+neg);
// 						}
// 					}
// 					res.json(parsed_politicians);
// 				});
// 			});
// 		}
// 	});
// });

function get_age_from_birthday(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}


app.get("/politicos",(req,res) => {
	var query_for_polis = 'select \
		pol.id, \
		pol.name, \
		pol.date_of_birth, \
		pol.party, \
		avg(vote.is_positive) as approval \
	from politician pol \
	inner join politician_vote vote on vote.politician_id=pol.id \
	group by pol.id'

	mysql_handler(query_for_polis, function(err, politicians){
		var parsed_politicians = [];

		for (var i = 0; i < politicians.length; i++) {
			var poli = politicians[i];

			var parsed_poli = {
				'politician_id': poli['id'],
				'ranking': poli['id'], // faaaake
				'nome': poli['name'],
				'idade': get_age_from_birthday(poli['date_of_birth']) + ' anos',
				'partido': poli['party'],
				'approval': poli['approval']
			}

			parsed_politicians.push(parsed_poli);
		}

		res.json(parsed_politicians);
	});
});


app.get("/politicos/:politician_id",(req,res) => {
	var politician_id = req.params['politician_id'];

	var query_for_polis = 'select \
		pol.id, \
		pol.name, \
		pol.date_of_birth, \
		pol.party, \
		avg(vote.is_positive) as approval \
	from politician pol \
	inner join politician_vote vote on vote.politician_id=pol.id \
	where pol.id=?';

	mysql_handler(query_for_polis, [politician_id], function(err, politicians){
		var parsed_politicians = [];

		for (var i = 0; i < politicians.length; i++) {
			var poli = politicians[i];

			var parsed_poli = {
				'politician_id': poli['id'],
				'ranking': poli['id'], // faaaake
				'nome': poli['name'],
				'idade': get_age_from_birthday(poli['date_of_birth']) + ' anos',
				'partido': poli['party'],
				'approval': poli['approval']
			}

			parsed_politicians.push(parsed_poli);
		}

		res.json(parsed_politicians);
	});
});


app.listen(port, () => {
	console.log('Listening on port '+ port);
});