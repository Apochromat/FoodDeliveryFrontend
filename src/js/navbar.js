import { authUser, logoutUser } from "/src/js/authAPI.js";

export function setNavbar() {
	return new Promise(async (resolve) => {
		let header = $("header");
		header.empty();
		let auth = await authUser();
		if (auth.auth) {
			$.get("/src/views/navbar.html", async function (data) {
				header.html(data);
				header.find("#user").text(`${auth.user.email}`);
				header.find("#logout").on("click", logoutUser);
				resolve(true);
			});
		} else {
			$.get("/src/views/navbarGuest.html", async function (data) {
				header.html(data);
				resolve(true);
			});
		}
	});
}
