const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const helpers = require("./helpers")











function get_filter_options(type) {
	return function(req, res, next) {
		query_for_options = "\
		SELECT group_concat(distinct party SEPARATOR ';') options, 'Partido' topic from politician UNION\
		SELECT group_concat(distinct name SEPARATOR ';') options, 'Cargo' topic from position UNION\
		SELECT group_concat(distinct location SEPARATOR ';') options, 'Localização' topic from politician_position;";

		if (type === 'proposal') {
			query_for_options = "SELECT group_concat(distinct category SEPARATOR ';') options, 'Assunto' topic from proposal UNION" + query_for_options
		}


		mysql_handler(query_for_options, function(err, topic_options){
			if (err) {return next(err);}

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