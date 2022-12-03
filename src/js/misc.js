export function zero(num) {
	let str = `${num}`;
	if (str.length === 1) {
        return '0'+str;
	}
    return str;
}
