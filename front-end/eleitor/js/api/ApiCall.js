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
			success(jsonResponse);
		} else {
			failure(request);
		}
	};
	var params = Object.keys(options).map(key => `${key}=${options[key]}`).join('&');
	request.open(method, `${baseURL}${path}?${params}`);
	// request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	request.send();

}

export default ApiCall;