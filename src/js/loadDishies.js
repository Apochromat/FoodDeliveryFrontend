import { dishSetup } from "/src/js/dishSetup.js";
import { searchParse, createSearchParameters } from "/src/js/router.js";

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
	// let response = await fetch(url);
	// if (response.ok) {
	// 	let json = await response.json();
	// 	return json;
	// } else {
	// 	return null;
	// }
}

export async function initMenu(args, router) {
	await initSearch(args);
	await attachSearch(router);
	if (args.page < 0) return;
	let dishesJSON = await getDishes(args);
	if (dishesJSON === null) {
		$.get("/src/views/emptyDishies.html", function (data) {
			let dishesContainer = $("#dishes-container");
			dishesContainer.append(data);
		});
		return;
	}
	let dishes = dishesJSON.dishes;
	let pages = dishesJSON.pagination;
	if (pages.count < 1) return;
	if (args.page > pages.count) {
		history.pushState({}, null, `/${pages.count}${args.raw}`);
		initMenu(pages.count);
		return;
	}
	$.get("/src/views/dishItem.html", function (data) {
		showDishes(dishes, args, data, pages.count);
	});
}

async function showDishes(dishes, args, dishTemplate, pages) {
	let dishesContainer = $("#dishes-container");
	dishes.forEach((curr) => {
		let newDish = dishSetup($(dishTemplate), curr);
		dishesContainer.append(newDish);
	});
	$(".dishItem").fadeOut(0).slideDown("normal");
	$.get("/src/views/pagination.html", function (data) {
		showPagination(args, data, pages);
	});
}

async function initSearch(params) {
	$("#searchCategoryCheck").selectpicker();
	$("#searchSortingCheck").selectpicker();
	if (params.categories !== undefined) {
		$("#searchCategoryCheck").selectpicker("val", params.categories);
	}

	if (params.sorting !== undefined) {
		$("#searchSortingCheck").selectpicker("val", params.sorting);
	}

	if (params.vegetarian !== undefined) {
		$("#searchVegeterianCheck").prop("checked", params.vegetarian === "true" ? true : false);
	}
}

async function attachSearch(router) {
	$(".searchSubmit").click(function() {
		runSearch(router);
	});
}

async function runSearch(router) {
	let search = { page: 1 };

	let categories = $("#searchCategoryCheck").val();
	if (categories.length !== 0) {
		search.categories = categories;
	}

	let sorting = $("#searchSortingCheck").val();
	search.sorting = sorting;

	let vegetarian = $("#searchVegeterianCheck").prop("checked");
	search.vegetarian = vegetarian;

	router.dispatch(window.location.pathname, `?${createSearchParameters(search)}`);
}

async function showPagination(args, pagination, pages) {
	let pagesElement = $(pagination);
	// минимальная страница
	if (args.page <= 1) pagesElement.find("#back").addClass("disabled");
	if (args.page <= 1) pagesElement.find("#begin").addClass("disabled");
	// максимальная страница
	if (args.page >= pages) pagesElement.find("#forward").addClass("disabled");
	if (args.page >= pages) pagesElement.find("#end").addClass("disabled");

	// кнопки стрелок начала и конца
	pagesElement.find("#begin").attr("href", `/?${createSearchParameters(args, 1)}`);
	pagesElement.find("#end").attr("href", `/?${createSearchParameters(args, pages)}`);
	// кнопки стрелов вперед и назад
	pagesElement.find("#back").attr("href", `/?${createSearchParameters(args, args.page - 1)}`);
	pagesElement.find("#forward").attr("href", `/?${createSearchParameters(args, args.page + 1)}`);

	let page1 = pagesElement.find("#page1");
	let page2 = pagesElement.find("#page2");
	let page3 = pagesElement.find("#page3");

	if (pages == 1) {
		page2.remove();
		page3.remove();
		page1
			.text("1")
			.addClass("active")
			.attr("href", `/?${createSearchParameters(args, 1)}`);
	} else if (pages == 2) {
		page3.remove();
		page1.text("1").attr("href", `/?${createSearchParameters(args, 1)}`);
		page2.text("2").attr("href", `/?${createSearchParameters(args, 2)}`);
		args.page == 1 ? page1.addClass("active") : page2.addClass("active");
	} else {
		let activePage = 2;
		let firstValue, lastValue;
		firstValue = args.page - 1;
		lastValue = args.page + 1;
		while (lastValue > pages) {
			activePage++;
			firstValue--;
			lastValue--;
		}
		while (firstValue < 1) {
			activePage--;
			firstValue++;
			lastValue++;
		}

		page1.text(firstValue).attr("href", `/?${createSearchParameters(args, firstValue)}`);
		page2.text(firstValue + 1).attr("href", `/?${createSearchParameters(args, firstValue + 1)}`);
		page3.text(firstValue + 2).attr("href", `/?${createSearchParameters(args, firstValue + 2)}`);
		pagesElement.find(`#page${activePage}`).addClass("active");
	}
	$("#dishes-container").after(pagesElement);
}
