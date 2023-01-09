export async function getOrders() {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/order`);
	let t;
	await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Accept: "*/*",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.status === 400) {
				throw new Error("your error message here");
			}
			return res.json();
		})
		.then((json) => {
			t = json;
		})
		.catch((ex) => {
			t = null;
		});
	return t;
}

export async function getOrder(id) {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/order/${id}`);
	let t;
	await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Accept: "*/*",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.status === 400 || res.status === 404 ) {
				return null;
			}
			return res.json();
		})
		.then((json) => {
			t = json;
		})
		.catch((ex) => {
			return null;
		});
	return t;
}

export async function createOrder(time, address) {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/order`);
	let t;
	await fetch(url, {
        method:"POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "*/*",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			deliveryTime: time,
			address: address,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			t = json;
		})
		.catch((ex) => {
			t = null;
		});
	return t;
}

export async function confirmOrder(id) {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/order/${id}/status`);
	let t;
	await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "*/*",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.status === 400) {
				throw new Error("your error message here");
			}
			return res.json();
		})
		.then((json) => {
			t = json;
		})
		.catch((ex) => {
			t = null;
		});
	return t;
}