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
const jwt = require('jsonwebtoken');
var config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
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
	return jwt.sign(user_info, token_secret, {'expiresIn' : '30d' });
	// return jwt.sign(user_info, token_secret, {'expiresIn' : '1s' });
}






function jwt_mw(req, res, next) {
	var token = req.query['token'];

	if (!token) {return next('Precisa do token!')}

	verify_token(token, function(err, user_info){
		if (err) {return next(err)}

		req.user = user_info;
		return next();
	});
}



module.exports = {
  'parse_bool': parse_bool,
  'format_null_bool': format_null_bool,
	'parse_null_bool': parse_null_bool,
	'parse_null_bool_db': parse_null_bool_db,
	'debug_print': debug_print,
	'get_age_from_birthday': get_age_from_birthday,

	'verify_token': verify_token,
	'create_token': create_token,

	'jwt_mw': jwt_mw,
}
