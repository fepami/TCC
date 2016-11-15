const express = require("express");
const app = express();

const http = require('http');
const moment = require('moment');
moment.locale('pt-br');

const hostname = '127.0.0.1';
const port = 3000;

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const helpers = require("./helpers")

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
				return;
			}
			res.json(result);
		});
	}
});


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
			APPROVAL_T.approval as approval,\
			USER_VOTE_T.is_positive as user_vote\
		from proposal prop\
		left join (select proposal_id, avg(is_positive) as approval from proposal_vote group by proposal_id\
			) APPROVAL_T on APPROVAL_T.proposal_id=prop.id\
		left join (select v.proposal_id, v.is_positive from proposal_vote v\
								inner join user u on u.id=v.user_id where u.device_id=?\
			) USER_VOTE_T on USER_VOTE_T.proposal_id = prop.id';
		query_for_props[1] = '';

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
					'cargo': null
				}

				parsed_proposals.push(parsed_prop);
			}

			return parsed_proposals;
		}

		var device_id = req.query['device_id'];
		if (type === 'politician') {
			var politician_id = req.params['politician_id'];


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


var get_politicians_func = require("./politicians.js").get_politicians_func;

app.get("/politicos", get_politicians_func());
app.get("/politicos/:politician_id", get_politicians_func());
app.get("/politicos_seguidos", get_politicians_func('follow')); // /politicos/seguidos?device_id=device_id1


app.get("/politicos/:politician_id/votar",(req,res) => {
	// assumindo q vai vir device_id e is_positive pelo get
	// http://localhost:3000/politicos/1/votar?device_id=device_id4&is_positive=1
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

			var is_positive = helpers.parse_null_bool(req.query['is_positive']);
			if (existing_vote.length > 0) {
				var existing_is_positive = helpers.parse_bool(existing_vote[0]['is_positive'])
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
		if (err) {
			res.json(err);
		} else {
			var follow = helpers.parse_bool(req.query['follow']);
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










app.get("/propostas", get_proposals_func());
app.get("/propostas/:proposal_id", get_proposals_func());

var cmd_args = process.argv.slice(2);
if (cmd_args.indexOf('live') != -1) {
	const https = require('https');
	const fs = require('fs');
	const https_options = {
	  key: fs.readFileSync('key.pem'),
	  cert: fs.readFileSync('cert.pem')
	};
	https.createServer(https_options, app).listen(443);
}
http.createServer(app).listen(port);
