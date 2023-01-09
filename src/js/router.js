import { initMenu } from "/src/js/menuPage.js";
import { initLoginPage } from "/src/js/loginPage.js";
import { initRegisterPage } from "/src/js/registerPage.js";
import { initProfilePage } from "/src/js/profilePage.js";
import { initDishPage } from "/src/js/dishPage.js";
import { initBasketPage } from "/src/js/basketPage.js";
import { initOrdersPage } from "/src/js/ordersPage.js";
import { initOrderPage } from "/src/js/orderPage.js";
import { initPurchasePage } from "/src/js/purchasePage.js";
import { setNavbar } from "/src/js/navbar.js";
import { countBasket } from "/src/js/basketAPI.js";
import { initToggle } from "/src/js/themeToggle.js";

let router = {
	routes: [
		{ pattern: /^\/404$/, callback: "notfound", nav: [] },
		{ pattern: /^\/profile$/, callback: "profile", nav: ["user"] },
		{ pattern: /^\/registration$/, callback: "register", nav: ["registerLink"] },
		{ pattern: /^\/login$/, callback: "login", nav: ["loginLink"] },
		{ pattern: /^\/cart$/, callback: "cart", nav: ["cartLink"] },
		{ pattern: /^\/orders$/, callback: "orders", nav: ["ordersLink"] },
		{ pattern: /^\/purchase$/, callback: "purchase", nav: [] },
		{ pattern: /^\/item\/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/, callback: "dish", nav: [] },
		{ pattern: /^\/order\/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/, callback: "order", nav: [] },
		{ pattern: /^\/$/, callback: "menu", nav: ["dishesLink"] },
	],

	dispatch: async function (path, search, pushHistory = true) {
		for (let i = 0; i < this.routes.length; ++i) {
			let args = path.match(this.routes[i].pattern);
			if (args) {
				$("main").empty();
				if (localStorage.getItem("jwt")) $("#basketBadge").text(`${await countBasket()}`);
				if (!routerFunctions[this.routes[i].callback].apply(this, [args.slice(1), search])) {
					return;
				}
				if (pushHistory) history.pushState({}, null, `${path}${search}`);
				initToggle();
				$(".navbar-nav a").removeClass("active");
				this.routes[i].nav.forEach((val) => $(`#${val}`).addClass("active"));
				return;
			}
		}
		routerFunctions["default"]();
	},

	init: async function () {
		await setNavbar();
		$(document).on("click", function (event) {
			if (event.target.href != undefined) {
				event.preventDefault();
				let url = new URL(event.target.href);
				if (window.location.pathname != url.pathname || window.location.search != url.search)
					router.dispatch(url.pathname, url.search);
			}
		});
	},

	checkLogin: function () {
		let user = localStorage.getItem("user");
		return user && JSON.parse(user).auth;
	},
};

let routerFunctions = {
	default: function () {
		window.location.pathname = "/404";
		router.dispatch(window.location.pathname, "");
	},

	notfound: function () {
		$("main").load("/src/views/notFound.html");
		return true;
	},

	menu: function (args, search) {
		let parsed = searchParse(search);
		$("main").load("/src/views/menuContainer.html", () => initMenu(parsed, router));
		return true;
	},

	login: function () {
		if (router.checkLogin()) {
			router.dispatch("/", "");
			return false;
		}

		$("main").load("/src/views/login.html", () => initLoginPage());
		return true;
	},

	register: function () {
		if (router.checkLogin()) {
			router.dispatch("/", "");
			return false;
		}
		$("main").load("/src/views/register.html", () => initRegisterPage());
		return true;
	},

	profile: function () {
		if (!router.checkLogin()) {
			router.dispatch("/login", "");
			return false;
		}
		$("main").load("/src/views/profile.html", () => initProfilePage());
		return true;
	},

	dish: function (args, search) {
		$("main").load("/src/views/dishItem.html", () => initDishPage(args, router));
		return true;
	},

	cart: function () {
		if (!router.checkLogin()) {
			router.dispatch("/", "");
			return false;
		}
		$("main").load("/src/views/basketContainer.html", () => initBasketPage());
		return true;
	},

	orders: function () {
		if (!router.checkLogin()) {
			router.dispatch("/", "");
			return false;
		}
		$("main").load("/src/views/ordersContainer.html", () => initOrdersPage(router));
		return true;
	},

	order: function (args, search) {
		if (!router.checkLogin()) {
			router.dispatch("/", "");
			return false;
		}
		$("main").load("/src/views/orderContainer.html", async () => await initOrderPage(args, router));
		return true;
	},

	purchase: function () {
		if (!router.checkLogin()) {
			router.dispatch("/", "");
			return false;
		}
		$("main").load("/src/views/purchaseContainer.html", () => initPurchasePage(router));
		return true;
	},
};

$(document).one("DOMContentLoaded", async function () {
	await router.init();
	router.dispatch(window.location.pathname, window.location.search);
});

$(window).on("popstate", function () {
	router.dispatch(window.location.pathname, window.location.search, false);
});

export function searchParse(search, searchpage = true) {
	let output = {
		raw: search,
	};

	if (searchpage) {
		output.page = 1;
		const pageRegex = /[\?&]page=(?<pageNumber>[1-9][0-7]*)/gm;
		for (const match of search.matchAll(pageRegex)) {
			output.page = parseInt(match.groups.pageNumber);
		}
	}
	const categoriesRegex = /[\?&]categories=(?<category>\w*)/gm;
	if (search.match(categoriesRegex) !== null) {
		output.categories = [];
	}
	for (const match of search.matchAll(categoriesRegex)) {
		output.categories.push(match.groups.category);
	}

	const vegetarianRegex = /[\?&]vegetarian=(?<vegetarian>\w*)/gm;
	for (const match of search.matchAll(vegetarianRegex)) {
		output.vegetarian = match.groups.vegetarian;
	}

	const sortingRegex = /[\?&]sorting=(?<sorting>\w*)/gm;
	for (const match of search.matchAll(sortingRegex)) {
		output.sorting = match.groups.sorting;
	}

	return output;
}

export function createSearchParameters(args, page = null) {
	let output = new URLSearchParams();

	if (args.page !== undefined) {
		output.set("page", args.page);
	}
	if (page !== null) {
		{
			output.set("page", page);
		}
	}
	if (args.categories !== undefined) {
		for (let category of args.categories) {
			output.append("categories", category);
		}
	}
	if (args.sorting !== undefined) {
		output.set("sorting", args.sorting);
	}
	if (args.vegetarian !== undefined) {
		output.set("vegetarian", args.vegetarian);
	}

	return output.toString();
}
