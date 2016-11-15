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
			CUR_POS_T.vote_code as vote_code,\
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
								inner join user u on u.id=v.user_id where u.device_id=?\
			) USER_VOTE_T on USER_VOTE_T.politician_id = pol.id\
		left join (select pp.politician_id, pos.name, pp.location, pp.vote_code, pp.start_date, DATE_ADD(DATE_ADD(pp.start_date, INTERVAL pos.term_length YEAR), INTERVAL -1 DAY) as predicted_end_date \
								from politician_position pp\
								inner join position pos on pos.id = pp.position_id\
								where pp.end_date is null AND pp.start_date is not null\
			) CUR_POS_T on CUR_POS_T.politician_id=pol.id\
		left join (select f.politician_id\
								from politician_follow f\
								inner join user u on u.id=f.user_id where u.device_id=?\
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
					'approval': poli['approval'],
					'user_vote': helpers.format_null_bool(poli['user_vote']),
					'n_p_votar': poli['vote_code'],
					'photo_url': poli['photo_url'],
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

		var device_id = req.query['device_id'];
		if (type === 'follow') {
			query_for_polis[1] = 'inner join politician_follow f on f.politician_id = pol.id\
			inner join user u on u.id = f.user_id\
			where u.device_id=?';

			mysql_handler(query_for_polis.join('\n'), [device_id, device_id ,device_id], function(err, politicians){
				if (err) {
					res.json(err);
					return;
				}
				res.json(parse_politicians(politicians));
			});
		} else {
			if ('politician_id' in req.params) {
				var politician_id = req.params['politician_id'];

				query_for_polis[1] = 'where pol.id=?';

				mysql_handler(query_for_polis.join('\n'), [device_id, device_id, parseInt(politician_id)], function(err, politicians){
					if (err) {
						res.json(err);
						return;
					}
					res.json(parse_politicians(politicians));
				});
			} else {
				helpers.debug_print(query_for_polis.join('\n'))
				mysql_handler(query_for_polis.join('\n'), [device_id, device_id], function(err, politicians){
					if (err) {
						res.json(err);
						return;
					}
					res.json(parse_politicians(politicians));
				});
			}
		}
	}

	return get_politicians;
}

module.exports = {
  'get_politicians_func': get_politicians_func
}
