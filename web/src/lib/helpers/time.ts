export function padTo2Digits(num: number) {
	return num.toString().padStart(2, "0");
}

export function convertMsToTime(milliseconds: number) {
	let seconds = milliseconds / 1000;
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);

	seconds = seconds % 60;
	minutes = minutes % 60;
	//hours = hours % 24;

	return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}
