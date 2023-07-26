function getDate(time) {
	let date = new Date(time);
	let year = date.getFullYear();
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let day = date.getDate().toString().padStart(2, '0');
	let hours = date.getHours().toString().padStart(2, '0');
	let minutes = date.getMinutes().toString().padStart(2, '0');
	let seconds = date.getSeconds().toString().padStart(2, '0');
	return year + "年" + month + "月" + day + "日" + "\t" + hours + ":" + minutes + ":" + seconds;
}

export default {
	getDate
}