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

var politicians_controller = require("./politicians.js");
var proposals_controller = require("./proposals.js");


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



app.get("/politicos", politicians_controller.get_politicians_func());
app.get("/politicos/:politician_id", politicians_controller.get_politicians_func());
app.get("/politicos_seguidos", politicians_controller.get_politicians_func('follow')); // /politicos/seguidos?device_id=device_id1

app.get("/politicos/:politician_id/propostas", proposals_controller.get_proposals_func('politician'));

app.get("/politicos/:politician_id/votar", politicians_controller.vote);
app.get("/politicos/:politician_id/seguir", politicians_controller.follow);



app.get("/propostas", proposals_controller.get_proposals_func());
app.get("/propostas/:proposal_id", proposals_controller.get_proposals_func());

app.get("/propostas/:proposal_id/votar", proposals_controller.vote);

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
