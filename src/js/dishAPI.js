import { searchParse, createSearchParameters } from "/src/js/router.js";

export async function checkRating(id) {
    let token = localStorage.getItem("jwt");
    if (!token) return;
	var url = new URL(`${api_url}/dish/${id}/rating/check`);
    let t;
	await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
        }})
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

export async function setRating(id, rating) {
    let token = localStorage.getItem("jwt");
    if (!token) return;
	var url = new URL(`${api_url}/dish/${id}/rating`);
    url.search = new URLSearchParams({"ratingScore": rating});
    let t;
	await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
        }})
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

export async function getDishes(args) {
	var url = new URL(`${api_url}/dish`);
	url.search = createSearchParameters(args);
	let t;
	await fetch(url)
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

export async function getDish(id) {
	var url = new URL(`${api_url}/dish/${id}`);
	let t;
	await fetch(url)
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