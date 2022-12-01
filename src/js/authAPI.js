export async function authUser() {
	let token = localStorage.getItem("jwt");
	let guest = { auth: false, user: {} };
	try {
		if (!token) throw new Error();
		let response = await fetch(`${api_url}/account/profile`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "*/*",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			let json = await response.json();
			let user = {
				auth: true,
				user: json,
			};
			localStorage.setItem("user", JSON.stringify(user));
			return user;
		}
		return guest;
	} catch {
		localStorage.removeItem("jwt");
		localStorage.setItem("user", JSON.stringify(guest));
		return guest;
	}
}

export async function logoutUser(resume = true) {
	let token = localStorage.getItem("jwt");
	localStorage.removeItem("jwt");
	let user = {
		auth: false,
		user: {},
	};
	localStorage.setItem("user", JSON.stringify(user));
	if (!token) return;
	try {
		if (!resume) throw new Error();
		await fetch(`${api_url}/account/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "*/*",
				Authorization: `Bearer ${token}`,
			},
		});
	} finally {
		location.reload();
	}
}

export async function loginUser(login, password) {
	let response = await fetch(`${api_url}/account/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "*/*",
		},
		body: JSON.stringify({
			email: login,
			password: password,
		}),
	});
	if (response.ok) {
		let json = await response.json();
		localStorage.setItem("jwt", json.token);
		return true;
	}
	return false;
}

export async function registerUser(email, pass, name, address, phone, birth, sex) {
    let model = {
        fullName: name,
        password: pass,
        email: email,
        birthDate: `${birth}T00:00:00.000Z`,
		gender: sex == "Мужской" ? "Male" : "Female",
        phoneNumber: phone,
        address: address
    }
    // if (phone !== "") { model.phone = phone; }
    // if (address !== "") { model.address = address; }

	let response = await fetch(`${api_url}/account/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "*/*",
		},
		body: JSON.stringify(model),
	});
    
    if (response.ok) {
        let json = await response.json();
        localStorage.setItem("jwt", json.token);
        return {
            ok: true,
            msg: "Успех",
            response: response,
        };
    }
    return {
        ok: false,
        msg: "Ошибка сервера",
        response: response,
    };
}
