export async function getBasket() {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/basket`);
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

export async function addBasket(id) {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/basket/dish/${id}`);
	let t;
	await fetch(url, {
        method:"POST",
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

export async function deleteBasket(id, increase = false) {
	let token = localStorage.getItem("jwt");
	if (!token) return null;
	var url = new URL(`${api_url}/basket/dish/${id}`);
    url.search = new URLSearchParams({"increase": increase});
	let t;
	await fetch(url, {
        method:"DELETE",
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

export async function countBasket() {
	let t = await getBasket();
	if (t === null || t.length === 0) {return ""}
	return t.length
}