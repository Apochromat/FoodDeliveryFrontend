const api_url = "https://food-delivery.kreosoft.ru/api";
$(document).keypress(function (e) {
	if (e.which == 13) {
		$("#loginBtn").click();
		$("#signUpBtn").click();
	}
});

$.appear = function (selector, time = 1000) {
	$(selector).removeClass("d-none").fadeOut(0).show(time);
};

window.fetch = new Proxy(window.fetch, {
	apply(fetch, context, args) {
		let response;
		try {
			response = fetch.apply(context, args);
			response.then((data) => {
				if (data.status == 401) {
					localStorage.removeItem("jwt");
					localStorage.removeItem("user");
					if (window.location.pathname != "/login") location.href = "/login";
				}
			});
			return response;
		} catch (err) {
			throw err;
		}
	},
});
