const mysql_handler = require("./mysql_handler").handler

function parse_bool(value) {
	return (value === 'true' || value === true || value === 1 || value === '1');
}

function format_null_bool(bool_value) {
	if (bool_value === true) return 1;
	if (bool_value === false) return -1;
	if (bool_value === null) return 0;

	return format_null_bool(parse_bool(bool_value));
}

function parse_null_bool(string_value) {
	if (string_value === '1') return true;
	if (string_value === '-1') return false;
	if (string_value === '0') return null;

	return parse_bool(string_value);
}

function parse_null_bool_db(string_value) {
	if (string_value === 1) return true;
	if (string_value === 0) return false;
	if (string_value === null) return null;

	throw 'Valor inesperado do banco: ' + string_value;
}

var humanize_is_positive = function(is_positive){
	if (is_positive === true) {
		return 'positivo';
	} else if (is_positive === false) {
		return 'negativo';
	} else {
		return 'neutro';
	}
}

var humanize_is_positive_adverb = function(is_positive){
	if (is_positive === true) {
		return 'positivamente';
	} else if (is_positive === false) {
		return 'negativamente';
	} else {
		// neutramente???
		return 'negativamente';
	}
}

function debug_print(string){
	console.log('*********');
	console.log(string);
	console.log('*********');
}

function get_age_from_birthday(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
var app_email = config['app_email'];
var app_email_pass = config['app_email_pass'];

const nodemailer = require('nodemailer');
var send_mail = function(mail_parameters, callback){
	// var from = mail_parameters['from'];
	// var to = mail_parameters['to'];
	// var subject = mail_parameters['subject'];
	// var text = mail_parameters['text'];

	mail_parameters['from'] = "eleitor.app@gmail.com";

	// debug_print('creating transport!');
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: app_email,
      pass: app_email_pass
    }
  });

	// debug_print('sending mail....');
  smtpTransport.sendMail(mail_parameters, function(err, response){
  	// debug_print(err);
    if(err){return callback(err);}

    return callback(null, response);
  });
}


var register_activity = function(user_id, type, value, description){
	var create_activity_query = 'INSERT INTO user_activity SET ?';

	var activity_params = {
		'user_id': user_id,
		'description': description,
		'type': type,
		'value':value,
	}

	mysql_handler(create_activity_query, activity_params, function(err, result){
		if (err) {
			debug_print(`Erro ao criar registro de atividade do usuario (${user_id}): \n${err}`);
		}
	});
}






const jwt = require('jsonwebtoken');
var token_secret = config['token_secret']

function verify_token(token, callback) {
	jwt.verify(token, token_secret, function(err, user_info) {
		if(err){
		  return callback(err);
		};

		callback(null, user_info)
	})
}

function create_token(user_info) {
	return jwt.sign(user_info, token_secret, {'expiresIn' : '14d' });
}





const moment = require('moment');
moment.locale('pt-br');

function jwt_mw(req, res, next) {
	console.log(moment().format('DD/MM/YY h:mm:ss') + ': ' + req.get('host') + req.originalUrl);


	var token = req.query['token'];

	if (!token) {return next('Precisa do token!')}

	verify_token(token, function(err, user_info){
		if (err) {
			if (err.name === 'TokenExpiredError') {
				res.status(418);
				return res.json(err);
			}
			return next(err);
		}

		req.user = user_info;
		return next();
	});
}



module.exports = {
  'parse_bool': parse_bool,
  'format_null_bool': format_null_bool,
	'parse_null_bool': parse_null_bool,
	'parse_null_bool_db': parse_null_bool_db,
	'humanize_is_positive': humanize_is_positive,
	'humanize_is_positive_adverb': humanize_is_positive_adverb,

	'debug_print': debug_print,
	'get_age_from_birthday': get_age_from_birthday,

	'send_mail': send_mail,
	'register_activity': register_activity,

	'verify_token': verify_token,
	'create_token': create_token,

	'jwt_mw': jwt_mw,
}
