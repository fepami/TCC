const express = require("express");
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

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

function parseBool(value) {
	return (value === 'true' || value === true || value === 1);
}

function debug_print(string){
	console.log('*********');
	console.log(string);
	console.log('*********');
}

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

var get_politicians_func = function(type){
	var get_politicians = function(req, res) {
		var query_for_polis = [];
		query_for_polis[0] = 'select\
			pol.id,\
			pol.name,\
			pol.date_of_birth,\
			pol.party,\
			pol.ranking,\
			APPROVAL_T.approval as approval,\
			USER_VOTE_T.is_positive as user_vote,\
			CUR_POS_T.name as position,\
			CUR_POS_T.location as position_location\
		from politician pol\
		left join (select politician_id, avg(is_positive) as approval from politician_vote group by politician_id\
			) APPROVAL_T on APPROVAL_T.politician_id=pol.id\
		left join (select v.politician_id, v.is_positive from politician_vote v\
								inner join user u on u.id=v.user_id where u.device_id=?\
			) USER_VOTE_T on USER_VOTE_T.politician_id = pol.id\
		left join (select pp.politician_id, pos.name, pp.location\
			from politician_position pp\
			inner join position pos on pos.id = pp.position_id\
			where pp.end_date is null AND pp.start_date is not null) CUR_POS_T on CUR_POS_T.politician_id=pol.id';
		query_for_polis[1] = '';

		var parse_politicians = function(politicians) {
			var parsed_politicians = [];

			for (var i = 0; i < politicians.length; i++) {
				var poli = politicians[i];

				var parsed_poli = {
					'politician_id': poli['id'],
					'ranking': poli['ranking'],
					'nome': poli['name'],
					'idade': get_age_from_birthday(poli['date_of_birth']) + ' anos',
					'partido': poli['party'],
					'approval': poli['approval'],
					'user_vote': poli['user_vote'],
					'cargo': null
				}

				if (poli['position'] && poli['position_location']) {
					parsed_poli['cargo'] = poli['position'] + ' de ' + poli['position_location'];
				}

				parsed_politicians.push(parsed_poli);
			}

			return parsed_politicians;
		}

		var device_id = req.query['device_id'];
		if (type === 'follow') {
			query_for_polis[1] = 'inner join politician_follow f on f.politician_id = pol.id\
			inner join user u on u.id = f.user_id\
			where u.device_id=?';

			mysql_handler(query_for_polis.join('\n'), [device_id ,device_id], function(err, politicians){
				debug_print(query_for_polis.join('\n'));
				debug_print(device_id);
				debug_print(err);
				res.json(parse_politicians(politicians));
			});
		} else {
			if ('politician_id' in req.params) {
				var politician_id = req.params['politician_id'];

				query_for_polis[1] = 'where pol.id=?';

				mysql_handler(query_for_polis.join('\n'), [device_id, parseInt(politician_id)], function(err, politicians){
					res.json(parse_politicians(politicians));
				});
			} else {
				mysql_handler(query_for_polis.join('\n'), [device_id], function(err, politicians){
					debug_print(query_for_polis.join('\n').replace(/\t/g, ' ').replace('?', device_id))
					res.json(parse_politicians(politicians));
				});
			}
		}
	}

	return get_politicians;
}


app.get("/politicos", get_politicians_func());
app.get("/politicos/:politician_id", get_politicians_func());
app.get("/politicos_seguidos", get_politicians_func('follow')); // /politicos/seguidos?device_id=device_id1


app.get("/politicos/:politician_id/votar",(req,res) => {
	// assumindo q vai vir device_id e is_positive pelo get
	// http://localhost:3000/politicos/1/votar?device_id=device_id4&is_positive=true
	var politician_id = req.params['politician_id'];
	var device_id = req.query['device_id'];
	var existing_vote_query = 'select\
	  v.id as vote_id,\
	  v.is_positive\
	from politician_vote v\
	inner join user u on u.id=v.user_id\
	where u.device_id = ? and v.politician_id = ?;';

	mysql_handler(existing_vote_query, [device_id, politician_id], function(err, existing_vote){
		if (err) {
			res.json(err);
		} else {
			var update_ranking_query = 'UPDATE politician p\
				JOIN (\
				  SELECT\
				    @rank:=@rank+1 AS rank,\
				    APPROVAL_T.approval AS approval,\
				    APPROVAL_T.id AS id,\
				    APPROVAL_T.name AS name\
				  FROM (\
				    SELECT\
				      pol.id,\
				      pol.name,\
				      avg(vote.is_positive) AS approval\
				    FROM politician pol\
				    INNER join politician_vote vote ON vote.politician_id=pol.id\
				    GROUP BY pol.id\
				    ORDER BY approval DESC\
				  ) AS APPROVAL_T, (SELECT @rank:=0) meh\
				) RANKED_T ON RANKED_T.id = p.id\
				SET p.ranking = RANKED_T.rank;';

			var is_positive = parseBool(req.query['is_positive']);
			if (existing_vote.length > 0) {
				var existing_is_positive = parseBool(existing_vote[0]['is_positive'])
				var vote_id = existing_vote[0]['vote_id'];
				if (existing_is_positive !== is_positive) {
					// update
					var update_query = 'update politician_vote set is_positive = ? where id=?';
					mysql_handler(update_query, [is_positive, vote_id], function(err){
						if (err) {
							res.json(err);
						} else {
							mysql_handler(update_ranking_query, function(err){});
							res.json('ok, update');
						}
					});
				} else {
					res.json('ok, do nothing');
				}
			} else {
				// create
				var create_query = 'INSERT INTO politician_vote (user_id, politician_id, is_positive)\
				(SELECT u.id, ?, ? FROM user u WHERE u.device_id=?);';
				mysql_handler(create_query, [politician_id, is_positive, device_id], function(err){
					if (err) {
						res.json(err);
					} else {
						mysql_handler(update_ranking_query, function(err){});
						res.json('ok, create');
					}
				});
			}
		}
	});
});

app.get("/politicos/:politician_id/seguir",(req,res) => {
	// assumindo q vai vir device_id e is_positive pelo get
	// http://localhost:3000/politicos/1/seguir?device_id=device_id4&follow=true
	var politician_id = req.params['politician_id'];
	var device_id = req.query['device_id'];

	var existing_follow_query = 'select\
	  f.id as follow_id\
	from politician_follow f\
	inner join user u on u.id=f.user_id\
	where u.device_id = ? and f.politician_id = ?;';

	mysql_handler(existing_follow_query, [device_id, politician_id], function(err, existing_follow){
		debug_print(existing_follow)
		if (err) {
			res.json(err);
		} else {
			var follow = parseBool(req.query['follow']);
			if (existing_follow.length > 0 && !follow) {
				// delete
				var follow_id = existing_follow[0]['follow_id'];
				var delete_query = 'delete from politician_follow where id=?';
				mysql_handler(delete_query, [follow_id], function(err){
					if (err) {
						res.json(err);
					} else {
						res.json('ok, delete');
					}
				});
			} else if (existing_follow.length === 0 && follow) {
				// create
				var create_query = 'INSERT INTO politician_follow (user_id, politician_id)\
				(SELECT u.id, ? FROM user u WHERE u.device_id=?);';
				mysql_handler(create_query, [politician_id, device_id], function(err){
					if (err) {
						res.json(err);
					} else {
						res.json('ok, create');
					}
				});
			} else {
				res.json('ok, do nothing');
			}
		}
	});
});


app.listen(port, () => {
	console.log('Listening on port '+ port);
});