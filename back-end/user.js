const moment = require('moment');
moment.locale('pt-br');

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const bcrypt = require('bcryptjs');

const helpers = require("./helpers")



function _verify_user(email, password, callback) {
	var user_query = 'select id, password from user where email = ?';

	mysql_handler(user_query, [email], function(err, user){
		if (err) {
			return callback(err);
		}

		if (user.length == 0) {
			return callback(err);
		}

		user = user[0];
		// provavelmente precisa mudar pra async
		if (!bcrypt.compareSync(password, user['password'])) {
			return callback(null, null);
		}

		return callback(null, user);
	});
}
















function create_user(req, res) {
	var name = req.query['name'];
	var email = req.query['email'];
	var password = req.query['password'];
	var state = req.query['state'];
	var city = req.query['city'];
	var age = req.query['age'];
	var gender =  req.query['gender'];


	var existing_user_query = 'select id from user where email = ?';

	mysql_handler(existing_user_query, [email], function(err, existing_user){
		if (err) {
			return res.json(err);
		}

		if (existing_user.length > 0) {
			return res.json('Email já cadastrado');
		}

		var create_user_query = 'INSERT INTO user SET ?';
		user_params = {
			'name': name,
			'email': email,
			'password': bcrypt.hashSync(password, 8),
			'state': state,
			'city': city,
			'age': age,
			'gender': gender,
		}

		mysql_handler(create_user_query, user_params, function(err, result){
			if (err) {
				return res.json(err);
			}

			user_info = {
				'id': result.insertId,
			}

			var token = helpers.create_token(user_info);
			return res.json({token: token});
		});
	});
}

function email_login(req, res) {
	var email = req.query['email'];
	var password = req.query['password'];

	_verify_user(email, password, function(err, user){
		if (err) {
			res.json(err);
			return;
		}

		if (!user) {
			res.json('Usuário ou senha incorretos');
			return;
		}

		// repetido
		user_info = {
			'id': user['id'],
		}
		var token = helpers.create_token(user_info);

		return res.json({token: token});
	});
}


module.exports = {
  'email_login': email_login,
  'create_user': create_user,
}
