const baseUrl = "http://localhost:9090";

function requests(ApiUrl, data, method) {
	// #ifdef H5
	let url = "/api" + ApiUrl;
	// #endif
	
	// #ifndef H5
	let url = baseUrl + "/api" + ApiUrl;
	// #endif
	

	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header:{
				// 'content-type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'content-type': 'application/x-www-form-urlencoded',
			},
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}
function upload(data) {
	let url = baseUrl + "/api/upload";
	let method = "POST";
	return new Promise((resolve, reject) => {
		var boundary = Math.random().toString().substr(2);
		uni.request({
			url,
			data,
			method,
			header:{
				"content-type": "multipart/form-data; boundary="+boundary,
			},
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

export default {requests,upload,baseUrl}
