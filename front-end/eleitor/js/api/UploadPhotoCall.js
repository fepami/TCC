var UploadPhotoCall = function(path, data, success, failure) {
	var file = {
		uri: data,
		type: 'image/jpeg'
	}

	var request = new XMLHttpRequest();
	request.onreadystatechange = (e) => {
		if (request.readyState !== 4) {
			return;
		}
		if (request.status === 200) {
			success();
		} else {
			failure(request);
		}
	};
	request.open('PUT', `${path}`);
	request.setRequestHeader("Content-Type", "image/jpeg");
	request.send(file);
}

export default UploadPhotoCall;