const moment = require('moment');
moment.locale('pt-br');

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const helpers = require("./helpers")



var get_politicians_func = function(type){
	var get_politicians = function(req, res) {
		var query_for_polis = [];
		query_for_polis[0] = 'select\
			pol.id,\
			pol.name,\
			pol.date_of_birth,\
			pol.party,\
			pol.ranking,\
			pol.email,\
			pol.photo_url,\
			APPROVAL_T.approval as approval,\
			USER_VOTE_T.is_positive as user_vote,\
			CUR_POS_T.name as position,\
			CUR_POS_T.location as position_location,\
			LAST_ELEC_T.vote_code as vote_code,\
			CUR_POS_T.start_date as start_date,\
			CUR_POS_T.predicted_end_date as predicted_end_date,\
			USER_FOLLOW_T.politician_id as user_follow\
		from politician pol\
		left join (select politician_id, avg(is_positive) as approval\
							from politician_vote\
							group by politician_id\
			) APPROVAL_T on APPROVAL_T.politician_id=pol.id\
		left join (select v.politician_id, v.is_positive\
								from politician_vote v\
								where v.user_id=?\
			) USER_VOTE_T on USER_VOTE_T.politician_id = pol.id\
		left join (select pp.politician_id, pos.name, pp.location, pp.vote_code, pp.start_date, DATE_ADD(DATE_ADD(pp.start_date, INTERVAL pos.term_length YEAR), INTERVAL -1 DAY) as predicted_end_date \
								from politician_position pp\
								inner join position pos on pos.id = pp.position_id\
								where pp.end_date is null AND pp.start_date is not null\
			) CUR_POS_T on CUR_POS_T.politician_id=pol.id\
		left join (select pp.politician_id, pp.vote_code\
								from politician_position pp\
								inner join position pos on pos.id = pp.position_id\
								where pp.election_year = 2016\
			) LAST_ELEC_T on LAST_ELEC_T.politician_id=pol.id\
		left join (select f.politician_id\
								from politician_follow f\
								where f.user_id=?\
			) USER_FOLLOW_T on USER_FOLLOW_T.politician_id = pol.id\
		';
		query_for_polis[1] = '';

		var parse_politicians = function(politicians) {
			var parsed_politicians = [];

			for (var i = 0; i < politicians.length; i++) {
				var poli = politicians[i];

				var parsed_poli = {
					'politician_id': poli['id'],
					'ranking': poli['ranking'],
					'nome': poli['name'],
					'idade': helpers.get_age_from_birthday(poli['date_of_birth']) + ' anos',
					'partido': poli['party'],
					'email': poli['email'],
					'approval': poli['approval'] || 0,
					'user_vote': helpers.format_null_bool(poli['user_vote']),
					'n_p_votar': poli['vote_code'],
					'foto_url': poli['photo_url'],
					'cargo': null
				}

				if (poli['position'] && poli['position_location']) {
					parsed_poli['cargo'] = poli['position'] + ' de ' + poli['position_location'];
				}

				if (poli['start_date'] && poli['predicted_end_date']) {
					parsed_poli['vigencia'] = moment(poli['start_date']).format('LL') + ' a ' + moment(poli['predicted_end_date']).format('LL');
				}

				if (poli['user_follow'] == null) {
					parsed_poli['user_follow'] = false;
				} else {
					parsed_poli['user_follow'] = true;
				}

				parsed_politicians.push(parsed_poli);
			}

			return parsed_politicians;
		}

		var user_id = req.user['id'];
		if (type === 'follow') {
			query_for_polis[1] = 'inner join politician_follow f on f.politician_id = pol.id where f.user_id=?';

			mysql_handler(query_for_polis.join('\n'), [user_id, user_id ,user_id], function(err, politicians){
				if (err) {
					return res.json(err);
				}
				res.json(parse_politicians(politicians));
			});
		} else {
			if ('politician_id' in req.params) {
				var politician_id = req.params['politician_id'];

				query_for_polis[1] = 'where pol.id=?';

				mysql_handler(query_for_polis.join('\n'), [user_id, user_id, parseInt(politician_id)], function(err, politicians){
					if (err) {
						return res.json(err);
					}
					res.json(parse_politicians(politicians));
				});
			} else {
				mysql_handler(query_for_polis.join('\n'), [user_id, user_id], function(err, politicians){
					if (err) {
						return res.json(err);
					}
					res.json(parse_politicians(politicians));
				});
			}
		}
	}

	return get_politicians;
}

var vote = function(req,res) {
	var politician_id = req.params['politician_id'];
	var user_id = req.user['id'];
	var existing_vote_query = 'select\
	  v.id as vote_id,\
	  v.is_positive\
	from politician_vote v\
	where v.user_id = ? and v.politician_id = ?;';

	mysql_handler(existing_vote_query, [user_id, politician_id], function(err, existing_vote){
		if (err) {
			res.json(err);
		} else {
			var update_ranking_query = 'UPDATE politician p\
				JOIN (\
				  SELECT\
				    @rank:=@rank+1 AS rank,\
				    APPROVAL_T.approval AS approval,\
				    APPROVAL_T.id AS id\
				  FROM (\
				    SELECT\
				      pol.id,\
				      avg(vote.is_positive) AS approval\
				    FROM politician pol\
				    INNER join politician_vote vote ON vote.politician_id=pol.id\
				    GROUP BY pol.id\
				    ORDER BY approval DESC\
				  ) AS APPROVAL_T, (SELECT @rank:=0) meh\
				) RANKED_T ON RANKED_T.id = p.id\
				SET p.ranking = RANKED_T.rank;';

			var is_positive = helpers.parse_null_bool(req.query['user_vote']);
			if (existing_vote.length > 0) {
				var existing_is_positive = helpers.parse_null_bool_db(existing_vote[0]['is_positive'])
				var vote_id = existing_vote[0]['vote_id'];
				if (is_positive === null) {
					// delete
					var delete_query = 'delete from politician_vote where id=?';
					mysql_handler(delete_query, [vote_id], function(err){
						if (err) {
							res.json(err);
						} else {
							mysql_handler(update_ranking_query, function(err){});
							res.json('ok, delete');
						}
					});
				} else if (existing_is_positive !== is_positive) {
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
			} else if (is_positive !== null){
				// create
				var create_query = 'INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (?, ?, ?);';
				mysql_handler(create_query, [user_id, politician_id, is_positive], function(err){
					if (err) {
						res.json(err);
					} else {
						mysql_handler(update_ranking_query, function(err){});
						res.json('ok, create');
					}
				});
			} else {
				res.json('ok, do nothing');
			}
		}
	});
}

var follow = function(req,res) {
	var politician_id = req.params['politician_id'];
	var user_id = req.user['id'];

	var existing_follow_query = 'select\
	  f.id as follow_id\
	from politician_follow f\
	where f.user_id = ? and f.politician_id = ?;';

	mysql_handler(existing_follow_query, [user_id, politician_id], function(err, existing_follow){
		if (err) {
			res.json(err);
		} else {
			var follow = helpers.parse_bool(req.query['user_follow']);
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
				var create_query = 'INSERT INTO politician_follow (user_id, politician_id) VALUES (?, ?);';
				mysql_handler(create_query, [user_id, politician_id], function(err){
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
}

module.exports = {
  'get_politicians_func': get_politicians_func,
  'vote': vote,
  'follow': follow,
}
