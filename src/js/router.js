import { initMenu } from "/src/js/loadDishies.js";
import { setNavbar } from "/src/js/initNavbar.js";

let router = {
	routes: [
		/*{ pattern: /^\/login$/, callback: "login", nav: [] },
        { pattern: /^\/register$/, callback: "register", nav: [] },
        { pattern: /^\/orders$/, callback: "orders", nav: ["ordersLink"] },
        { pattern: /^\/profile$/, callback: "profile", nav: ["profileLink"] },
        { pattern: /^\/item\/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/,
          callback: "item", nav: ["itemLink"] },
        */
		{ pattern: /^\/$/, callback: "menu", nav: ["dishesLink"] },
	],

	dispatch: function (path, search, pushHistory = true) {
		for (let i = 0; i < this.routes.length; ++i) {
			let args = path.match(this.routes[i].pattern);
			if (args) {
				if (!routerFunctions[this.routes[i].callback].apply(this, [args.slice(1), search])) {
					return;
				}
				$("main").empty();
				if (pushHistory) history.pushState({}, null, `${path}${search}`);
				$(".me-auto a").removeClass("active");
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
		$("main").load("/src/views/404.html");
	},

	menu: function (args, search) {
		let parsed = searchParse(search);
		$("main").load("/src/views/dishesContainer.html", () => initMenu(parsed, router));
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
		raw: search
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

export function createSearchParameters(args) {
	let output = new URLSearchParams();

	if (args.page !== undefined) {output.set('page', args.page)}
	if (args.categories !== undefined) {
		for (let category of args.categories) {
			output.append('categories', category);
		}
	}
	if (args.sorting !== undefined) {output.set('sorting', args.sorting)}
	if (args.vegetarian !== undefined) {output.set('vegetarian', args.vegetarian)}

	return output.toString();
}