import store from '../redux/store';
import {setToken} from '../redux/actions/token';
import {AsyncStorage} from 'react-native';

const baseURL = 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/';
var ApiCall = function(path, options = {}, success, failure) {
	var request = new XMLHttpRequest();
	var method = options.method || 'GET';
	delete options.method;
	request.onreadystatechange = (e) => {
		if (request.readyState !== 4) {
			return;
		}
		if (request.status === 200) {
			const jsonResponse = JSON.parse(request.response);
			if(jsonResponse.token) {
				store.dispatch(setToken(jsonResponse.token));	
				AsyncStorage.setItem('token', jsonResponse.token);
			} 
			success(jsonResponse);
		} else {
			failure(request);
		}
	};
	var params = Object.keys(options).map(key => {
		if(Array.isArray(options[key])){
			return options[key].map(value => `${key}=${value}`).join('&');
		}
		return `${key}=${options[key]}`
	}).join('&');
	var test = `${baseURL}${path}?${params}`;
	request.open(method, `${baseURL}${path}?${params}`);
	// request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	request.send();
}

export default ApiCall;