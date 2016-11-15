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

	return parse_null_bool(format_null_bool(string_value));
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

module.exports = {
  'parse_bool': parse_bool,
  'format_null_bool': format_null_bool,
	'parse_null_bool': parse_null_bool,
	'parse_null_bool_db': parse_null_bool_db,
	'debug_print': debug_print,
	'get_age_from_birthday': get_age_from_birthday
}
