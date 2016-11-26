const moment = require('moment');
moment.locale('pt-br');

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const bcrypt = require('bcryptjs');

const helpers = require("./helpers")



function _verify_password(email, password, callback) {
	var user_query = 'select id, password, name, email, state, city, age, gender, photo_url from user where email = ?';

	mysql_handler(user_query, [email], function(err, user){
		if (err) {
			return callback(err);
		}

		if (user.length == 0) {
			return callback(err);
		}

		user = user[0];
		// provavelmente precisa mudar pra async
		if (!user['password']) {
			return callback(err);
		}

		if (!bcrypt.compareSync(password, user['password'])) {
			return callback(null, null);
		}

		delete user.password;
		return callback(null, user);
	});
}











function get_filter_options(type) {
	return function(req, res) {
		query_for_options = "\
		SELECT group_concat(distinct party SEPARATOR ';') options, 'Partido' topic from politician UNION\
		SELECT group_concat(distinct name SEPARATOR ';') options, 'Cargo' topic from position UNION\
		SELECT group_concat(distinct location SEPARATOR ';') options, 'Localização' topic from politician_position;";

		if (type === 'proposal') {
			query_for_options = "SELECT group_concat(distinct category SEPARATOR ';') options, 'Assunto' topic from proposal UNION" + query_for_options
		}


		mysql_handler(query_for_options, function(err, topic_options){
			if (err) {
				return res.json(err);
			}

			var filters = []
			for (var i = 0; i < topic_options.length; i++) {
				var filter = {}
				filter['topic'] = topic_options[i]['topic'];
				filter['options'] = topic_options[i]['options'] || '';
				filter['options'] = filter['options'].split(';');

				filters.push(filter);
			}

			filters.push({'topic': 'Aprovação', 'options':['Melhores Aprovados', 'Piores Aprovados']});



			return res.json(filters);
		});
	}
}

module.exports = {
  'get_politician_filter': get_filter_options('politician'),
  'get_proposal_filter': get_filter_options('proposal'),
}