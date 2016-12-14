const moment = require('moment');
moment.locale('pt-br');

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const bcrypt = require('bcryptjs');
const md5 = require("blueimp-md5")

const helpers = require("./helpers")



function _get_validated_user(user_id, email, password, callback) {
	var user_query = '';
	var user_query_param = null;
	if (user_id) {
		user_query = 'select id, password, name, email, state, city, age, gender, photo_url from user where id = ?';
		user_query_param = user_id;
	} else {
		user_query = 'select id, password, name, email, state, city, age, gender, photo_url from user where email = ?';
		user_query_param = email;
	}


	mysql_handler(user_query, [user_query_param], function(err, user){
		if (err) {
			return callback(err);
		}

		if (user.length == 0) {
			return callback(null);
		}

		user = user[0];
		if (!user['password']) {
			return callback(null);
		}

		// provavelmente precisa mudar pra async
		if (!bcrypt.compareSync(password, user['password'])) {
			return callback(null, null);
		}

		delete user.password;
		return callback(null, user);
	});
}
















function create_user(req, res, next) {
	var name = req.query['name'];
	var email = req.query['email'];
	var state = req.query['state'];
	var city = req.query['city'];
	var age = req.query['age'];
	var gender =  req.query['gender'];
	var photo_url =  req.query['photo_url'] || null;

	var facebook_user_id = req.query['profile_id'];
	var password = req.query['password'];
	var existing_user_query = 'select id from user where email = ?';
	var existing_user_query_params = [email]
	if (facebook_user_id) {
		existing_user_query += ' or facebook_id = ?';
		existing_user_query_params.push(facebook_user_id);
	}

	mysql_handler(existing_user_query, existing_user_query_params, function(err, existing_user){
		if (err) {return next(err);}

		if (existing_user.length > 0) {
			res.status(400);
			return res.json('Email/Profile_id já cadastrado');
		}

		var create_user_query = 'INSERT INTO user SET ?';
		user_params = {
			'name': name,
			'email': email,
			'state': state,
			'city': city,
			'age': age,
			'gender': gender,
			'photo_url': photo_url,
		}

		if (facebook_user_id) {
			user_params['facebook_id'] = facebook_user_id;
		} else {
			user_params['password'] = bcrypt.hashSync(password, 8);
		}

		mysql_handler(create_user_query, user_params, function(err, result){
			if (err) {return next(err);}

			user_info = {
				'id': result.insertId,
			}
			var token = helpers.create_token(user_info);

			user_params['token'] = token
			delete user_params.password;
			return res.json(user_params);
		});
	});
}

function login(req, res, next) {
	var facebook_user_id = req.query['profile_id']
	var email = req.query['email'];

	if (facebook_user_id) {
		var user_query = 'select id, name, email, state, city, age, gender, photo_url from user where ?? = ?';

		mysql_handler(user_query, ['facebook_id', facebook_user_id], function(err, user_by_fb){
			if (err) {return next(err)}

			// achou o user com fb
			if (user_by_fb.length > 0) {
				user_by_fb = user_by_fb[0]
				user_info = {
					'id': user_by_fb['id'],
				}
				var token = helpers.create_token(user_info);

				user_by_fb['token'] = token;
				return res.json(user_by_fb);
			}

			mysql_handler(user_query, ['email', email], function(err, user_by_email){
				if (err) {return next(err)}

				// linkar a conta existente com o fb
				if (user_by_email.length > 0) {
					user_by_email = user_by_email[0]

					var update_user_query = 'update user set ? where id=?';
					var user_id = user_by_email['id']
					mysql_handler(update_user_query, [{'facebook_id': facebook_user_id}, user_id], function(err){
						if (err) {return next(err)}

						user_info = {
							'id': user_id,
						}
						var token = helpers.create_token(user_info);

						user_by_email['token'] = token;
						return res.json(user_by_email);
					});
				} else {
					res.status(418); // I am a teapot!
					return res.send('New teapots must register first!');
				}
			});
		});
	} else {
		var password = req.query['password'];

		_get_validated_user(null, email, password, function(err, user){
			if (err) {
				return next(err);
			}

			if (!user) {
				res.status(404);
				return res.json('Usuário ou senha incorretos');
			}

			// repetido
			user_info = {
				'id': user['id'],
			}
			var token = helpers.create_token(user_info);

			user['token'] = token;
			return res.json(user);
		});
	}
}

function update_user(req, res, next) {
	var parameter_keys = ['name', 'state', 'city', 'age', 'gender', 'photo_url']

	// var email = req.query['email'];
	var user_params = {};
	parameter_keys.forEach(function(key){
		if (req.query[key]) {
			user_params[key] = req.query[key];
		}
	});

	if (Object.keys(user_params).length === 0) {
		return res.json('ok');
	}

	var user_id = req.user['id'];

	var update_user_query = 'update user set ? where id=?';

	mysql_handler(update_user_query, [user_params, user_id], function(err, result){
		if (err) {return next(err);}

		return res.json('ok');
	});
}

function update_password(req, res, next) {
	var new_password =  req.query['nova'];
	var old_password =  req.query['antiga'];
	var user_id = req.user['id'];

	_get_validated_user(user_id, null, old_password, function(err, user){
		if (err) {return next(err);}

		if (!user) {
			res.status(404);
			return res.json('Senha incorreta');
		}

		var update_user_query = 'update user set ? where id=?';
		var encrypted_pass = bcrypt.hashSync(new_password, 8);
		mysql_handler(update_user_query, [{'password': encrypted_pass}, user_id], function(err, result){
			if (err) {return next(err);}

			return res.json('ok')
		});
	});
}

function user_activities(req, res, next) {
	var user_id = req.user['id'];

	var get_activities_query = 'select description, created_at from user_activity where user_id=?';
	mysql_handler(get_activities_query, [user_id], function(err, user_activities){
		if (err) {return next(err);}

		var parsed_activities = [];
		user_activities.forEach(function(activity){
			parsed_activities.push({
							'descricao': activity['description'],
							'data': moment(activity['created_at']).format('lll'),
						})

		});

		return res.json(parsed_activities)
	});
}


var forgot_password = function(req, res, next){
  user_email = req.query['email'];

	var user_query = 'select id from user where email = ?';
	mysql_handler(user_query, [user_email], function(err, users){
	  if (err) {return next(err);}

	  if (users.length > 1) {
	  	return next(`Mais do que um usuário com o email: ${user_email}`);
	  }

	  if (users.length === 0) {
	  	return next(`Nenhum usuário com o email: ${user_email}`);
	  }

	  var user_id = users[0]['id']

	  var new_password = md5(Math.random(), Math.random());
	  new_password = new_password.substring(0, 10);

		var encrypted_pass = bcrypt.hashSync(new_password, 1);
		var update_user_query = 'update user set ? where id=?';
		mysql_handler(update_user_query, [{'password': encrypted_pass}, user_id], function(err, result){
			if (err) {return next(err);}

			var params = {
				to: user_email,
				subject: "Esqueceu a senha? Que burro!",
				text: `Sua nova senha eh: ${new_password}`
			}

			helpers.send_mail(params, function(err){
				if (err) {return res.json(err)}

				return res.json('ok');
			});
		});
	});
}



module.exports = {
  'login': login,
  'create_user': create_user,
  'update_user': update_user,
  'update_password': update_password,
  'forgot_password': forgot_password,
  'user_activities': user_activities,
}