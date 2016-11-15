const moment = require('moment');
moment.locale('pt-br');

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const helpers = require("./helpers")


var get_proposals_func = function(type){
	var get_proposals = function(req, res) {
		var query_for_props = [];
		query_for_props[0] = 'select\
			prop.id,\
			prop.code,\
			prop.summary,\
			prop.content,\
			prop.category,\
			prop.ranking,\
			prop.received_at,\
			GROUP_CONCAT(pp.politician_id) as politician_ids,\
			APPROVAL_T.approval as approval,\
			USER_VOTE_T.is_positive as user_vote\
		from proposal prop\
		inner join politician_proposal pp on pp.proposal_id = prop.id\
		left join (select proposal_id, avg(is_positive) as approval from proposal_vote group by proposal_id\
			) APPROVAL_T on APPROVAL_T.proposal_id=prop.id\
		left join (select v.proposal_id, v.is_positive from proposal_vote v\
								inner join user u on u.id=v.user_id where u.device_id=?\
			) USER_VOTE_T on USER_VOTE_T.proposal_id = prop.id';
		query_for_props[1] = '';
		query_for_props[2] = 'group by prop.id';

		var parse_proposals = function(proposals) {
			var parsed_proposals = [];

			for (var i = 0; i < proposals.length; i++) {
				var prop = proposals[i];

				var parsed_prop = {
					'proposal_id': prop['id'],
					'ranking': prop['ranking'],
					'nome': prop['summary'],
					'descricao': prop['content'],
					'categoria': prop['category'],
					'approval': prop['approval'],
					'user_vote': prop['user_vote'],
					'politicos': prop['politician_ids'].split(','),
					'data': moment(prop['received_at']).format('LL'),
					'cargo': null
				}

				parsed_proposals.push(parsed_prop);
			}

			return parsed_proposals;
		}

		var device_id = req.query['device_id'];
		if (type === 'politician') {
			var politician_id = req.params['politician_id'];
			query_for_props[1] = 'where pp.politician_id = ?';

			mysql_handler(query_for_props.join('\n'), [device_id, politician_id], function(err, proposals){
				res.json(parse_proposals(proposals));
			});

		} else if ('proposal_id' in req.params) {
			var proposal_id = req.params['proposal_id'];

			query_for_props[1] = 'where prop.id=?';

			mysql_handler(query_for_props.join('\n'), [device_id, parseInt(proposal_id)], function(err, proposals){
				res.json(parse_proposals(proposals));
			});
		} else {
			mysql_handler(query_for_props.join('\n'), [device_id], function(err, proposals){
				res.json(parse_proposals(proposals));
			});
		}
	}
	return get_proposals;
}

var vote = function(req,res) {
	// assumindo q vai vir device_id e is_positive pelo get
	// http://localhost:3000/politicos/1/votar?device_id=device_id4&is_positive=1
	var proposal_id = req.params['proposal_id'];
	var device_id = req.query['device_id'];
	var existing_vote_query = 'select\
	  v.id as vote_id,\
	  v.is_positive\
	from proposal_vote v\
	inner join user u on u.id=v.user_id\
	where u.device_id = ? and v.proposal_id = ?;';

	mysql_handler(existing_vote_query, [device_id, proposal_id], function(err, existing_vote){
		if (err) {
			res.json(err);
		} else {
			var update_ranking_query = 'UPDATE proposal p\
				JOIN (\
				  SELECT\
				    @rank:=@rank+1 AS rank,\
				    APPROVAL_T.approval AS approval,\
				    APPROVAL_T.id AS id\
				  FROM (\
				    SELECT\
				      pro.id,\
				      avg(vote.is_positive) AS approval\
				    FROM proposal pro\
				    INNER join proposal_vote vote ON vote.proposal_id=pro.id\
				    GROUP BY pro.id\
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
					var delete_query = 'delete from proposal_vote where id=?';
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
					var update_query = 'update proposal_vote set is_positive = ? where id=?';
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
				var create_query = 'INSERT INTO proposal_vote (user_id, proposal_id, is_positive)\
				(SELECT u.id, ?, ? FROM user u WHERE u.device_id=?);';
				mysql_handler(create_query, [proposal_id, is_positive, device_id], function(err){
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

module.exports = {
  'get_proposals_func': get_proposals_func,
  'vote': vote,
}
