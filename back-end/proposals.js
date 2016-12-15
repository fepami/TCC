const moment = require('moment');
moment.locale('pt-br');

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const helpers = require("./helpers")

var _get_where_filters = function(req){
	var filter_params = {'Categoria': 'prop.category', 'Partido': 'pol.party', 'Cargo':'CUR_POS_T.name', 'Localização':'CUR_POS_T.location'};
	var query_where_components = [];

	Object.keys(filter_params).forEach(function(param){
		var filter_value = req.query[param];
		if (filter_value) {
			if (filter_value.constructor === Array) {
				filter_value = filter_value.map(function(value){return `'${value}'`});
				filter_value = filter_value.join(',')
			} else {
				filter_value = `'${filter_value}'`;
			}

			query_where_components.push(filter_params[param] + " IN (" + filter_value + ")");
		}
	});

	var special_filter_value = req.query['special_filter'];
	if (special_filter_value) {
		query_where_components.push('(' + "prop.summary like '%"+ special_filter_value +"%' OR prop.category like '%"+ special_filter_value +"%'" + ')');
	}

	return query_where_components.join(' AND ');
}


var get_proposals_func = function(type){
	var get_proposals = function(req, res, next) {
		var query_for_props = [];
		query_for_props[0] = 'select\
			prop.id,\
			prop.code,\
			prop.summary,\
			prop.content,\
			prop.category,\
			prop.ranking,\
			prop.received_at,\
			GROUP_CONCAT(distinct pp.politician_id) as politician_ids,\
			COALESCE(APPROVAL_T.approval, 0.5) as approval,\
			USER_VOTE_T.is_positive as user_vote\
		from proposal prop\
		inner join politician_proposal pp on pp.proposal_id = prop.id\
		inner join politician pol on pol.id = pp.politician_id\
		left join (select proposal_id, avg(is_positive) as approval from proposal_vote group by proposal_id\
			) APPROVAL_T on APPROVAL_T.proposal_id=prop.id\
		left join (select v.proposal_id, v.is_positive from proposal_vote v where v.user_id=?\
			) USER_VOTE_T on USER_VOTE_T.proposal_id = prop.id\
		left join (\
			select * \
			from (\
					select pp.politician_id, pos.name, pp.location, pp.vote_code, pp.start_date, DATE_ADD(DATE_ADD(pp.start_date, INTERVAL pos.term_length YEAR), INTERVAL -1 DAY) as predicted_end_date \
					from politician_position pp\
					inner join position pos on pos.id = pp.position_id\
					where pp.end_date is null AND pp.start_date is not null\
					order by pp.start_date asc\
				) YAY_T group by politician_id\
			) CUR_POS_T on CUR_POS_T.politician_id=pol.id\
			';
		query_for_props[1] = '';
		query_for_props[2] = 'group by prop.id';
		query_for_props[3] = '';

		var parse_proposals = function(proposals, callback) {
			if (proposals.length === 0) {
				return callback(null, []);
			}

			var parsed_proposals = [];

			var politician_ids = proposals.map(function(prop){return prop['politician_ids'].split(',')});
			politician_ids = [].concat.apply([], politician_ids);


			query_for_polis = 'select\
				pol.id as politician_id,\
				pol.name as nome,\
				pol.party as partido,\
				pol.photo_url as foto_url\
			from politician pol\
			where pol.id in (?);';

			mysql_handler(query_for_polis, [politician_ids], function(err, politicians){
				if (err) {return callback(err)}

				politicians_by_id = {};
				for (var i = 0; i < politicians.length; i++) {
					politicians_by_id[politicians[i]['politician_id'].toString()] = politicians[i];
				}

				for (var i = 0; i < proposals.length; i++) {
					var prop = proposals[i];
					var politicians_info = prop['politician_ids'].split(',').map(function(id){return politicians_by_id[id]});

					var parsed_prop = {
						'proposal_id': prop['id'],
						'ranking': prop['ranking'],
						'nome': prop['summary'],
						'descricao': prop['content'],
						'categoria': prop['category'],
						'approval': prop['approval'],
						'user_vote': helpers.format_null_bool(prop['user_vote']),
						'politicos': politicians_info,
						'data': moment(prop['received_at']).format('LL'),
						'codigo': prop['code'],
						'cargo': null
					}

					parsed_proposals.push(parsed_prop);
				}

				// return parsed_proposals;
				return callback(null, parsed_proposals);
			});
		}

		var where_filters = _get_where_filters(req);
		var user_id = req.user['id'];
		if (type === 'politician') {
			var politician_id = req.params['politician_id'];
			query_for_props[1] = 'where pp.politician_id = ?';
			if (where_filters) {
				query_for_props[1] = query_for_props[1] + ' AND ' + where_filters;
			}

			mysql_handler(query_for_props.join('\n'), [user_id, politician_id], function(err, proposals){
				if (err) {return next(err)}

				parse_proposals(proposals, function(err, parsed_props){
					if (err) {return next(err)}
					return res.json(parsed_props);
				});
			});
		} else if (type === 'ranking') {
			query_for_props[3] = 'order by prop.ranking limit 10';

			if (where_filters) {
				query_for_props[1] = 'where ' + where_filters;
			}

			mysql_handler(query_for_props.join('\n'), [user_id], function(err, proposals){
				if (err) {return next(err);}
				parse_proposals(proposals, function(err, parsed_props){
					if (err) {return next(err)}
					return res.json(parsed_props);
				});
			});
		} else if ('proposal_id' in req.params) {
			var proposal_id = req.params['proposal_id'];

			query_for_props[1] = 'where prop.id=?';

			mysql_handler(query_for_props.join('\n'), [user_id, parseInt(proposal_id)], function(err, proposals){
				if (err) {return next(err)}

				parse_proposals(proposals, function(err, parsed_props){
					if (err) {return next(err)}
					return res.json(parsed_props);
				});
			});
		} else {
			if (where_filters) {
				query_for_props[1] = 'where ' + where_filters;
			}
			query_for_props[3] = 'limit 10';

			mysql_handler(query_for_props.join('\n'), [user_id], function(err, proposals){
				if (err) {return next(err)}

				parse_proposals(proposals, function(err, parsed_props){
					if (err) {return next(err)}
					return res.json(parsed_props);
				});
			});
		}
	}
	return get_proposals;
}

var vote = function(req, res, next) {
	// assumindo q vai vir device_id e is_positive pelo get
	// http://localhost:3000/politicos/1/votar?device_id=device_id4&is_positive=1
	var proposal_id = req.params['proposal_id'];
	var user_id = req.user['id'];
	var existing_vote_query = 'select\
		v.id as vote_id,\
		v.is_positive\
	from proposal_vote v\
	where v.user_id = ? and v.proposal_id = ?;';

	mysql_handler(existing_vote_query, [user_id, proposal_id], function(err, existing_vote){
		if (err) {return next(err);}
		var update_ranking_query = 'UPDATE proposal p\
			JOIN (\
				SELECT\
					@rank:=@rank+1 AS rank,\
					APPROVAL_T.approval AS approval,\
					APPROVAL_T.id AS id\
				FROM (\
					SELECT\
						pro.id,\
						COALESCE(avg(vote.is_positive), 0.5) AS approval\
					FROM proposal pro\
					LEFT join proposal_vote vote ON vote.proposal_id=pro.id\
					GROUP BY pro.id\
					ORDER BY approval DESC\
				) AS APPROVAL_T, (SELECT @rank:=0) meh\
			) RANKED_T ON RANKED_T.id = p.id\
			SET p.ranking = RANKED_T.rank;';

		var get_approval_query = 'select\
			COALESCE(avg(is_positive), 0.5) as approval\
		from proposal_vote\
		where proposal_id = ?'

		var get_proposal_query = 'SELECT prop.code from proposal prop where id=?';

		var is_positive = helpers.parse_null_bool(req.query['user_vote']);
		mysql_handler(get_proposal_query, [proposal_id], function(err, proposal){
			if (err) {return next(err);}
			var proposal_code = proposal[0]['code'];

			if (existing_vote.length > 0) {
				var existing_is_positive = helpers.parse_null_bool_db(existing_vote[0]['is_positive']);
				var vote_id = existing_vote[0]['vote_id'];
				if (is_positive === null) {
					// delete
					var delete_query = 'delete from proposal_vote where id=?';
					mysql_handler(delete_query, [vote_id], function(err){
						if (err) {return next(err);}

						helpers.register_activity(user_id, 'vote', is_positive, `Retirou o seu voto ${helpers.humanize_is_positive(existing_is_positive)} para a proposta ${proposal_code}.`);
						mysql_handler(update_ranking_query, function(err){});
						mysql_handler(get_approval_query, [proposal_id], function(err, new_approval){
							if (err) {return next(err);}
							return res.json(new_approval);
						});
					});
				} else if (existing_is_positive !== is_positive) {
					// update
					var update_query = 'update proposal_vote set is_positive = ? where id=?';
					mysql_handler(update_query, [is_positive, vote_id], function(err){
						if (err) {return next(err);}
						helpers.register_activity(user_id, 'vote', is_positive, `Votou ${helpers.humanize_is_positive_adverb(is_positive)} na proposta ${proposal_code}.`);
						mysql_handler(update_ranking_query, function(err){});
						mysql_handler(get_approval_query, [proposal_id], function(err, new_approval){
							if (err) {return next(err);}
							return res.json(new_approval);
						});
					});
				} else {
					mysql_handler(get_approval_query, [proposal_id], function(err, new_approval){
						if (err) {return next(err);}
						return res.json(new_approval);
					});
				}
			} else if (is_positive !== null){
				// create
				var create_query = 'INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (?, ?, ?);';
				mysql_handler(create_query, [user_id, proposal_id, is_positive], function(err){
					if (err) {return next(err);}

					helpers.register_activity(user_id, 'vote', is_positive, `Votou ${helpers.humanize_is_positive_adverb(is_positive)} na proposta ${proposal_code}.`);
					mysql_handler(update_ranking_query, function(err){});
					mysql_handler(get_approval_query, [proposal_id], function(err, new_approval){
						if (err) {return next(err);}
						return res.json(new_approval);
					});
				});
			} else {
				mysql_handler(get_approval_query, [proposal_id], function(err, new_approval){
					if (err) {return next(err);}
					return res.json(new_approval);
				});
			}
		});
	});
}

module.exports = {
	'get_proposals': get_proposals_func(),
	'get_ranking': get_proposals_func('ranking'),
	'get_proposal': get_proposals_func(),
	'get_politician_proposals': get_proposals_func('politician'),
	'filtered_by_special_filter': get_proposals_func('special_filter'),





	'vote': vote,
}
