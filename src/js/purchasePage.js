import { createOrder } from "/src/js/orderAPI.js";
import { getBasket } from "/src/js/basketAPI.js";
import { getProfileDetails, changeProfile } from "/src/js/profileAPI.js";
import { run } from "/src/js/inputValidation.js";

export async function initPurchasePage(router) {
	let basketJSON = await getBasket();
	if (basketJSON === null || basketJSON.length === 0) {
		router.dispatch("/orders", "");
		return;
	}

	let details = await getProfileDetails();
	$("#staticEmail").val(details.email);
	$("#staticPhone").val(details.phoneNumber);

	$("#date").attr("min", new Date().toISOString().slice(0, 16));

	run();

	$.get("/src/views/orderDishCard.html", function (data) {
		showItems(basketJSON, data);
	});

	await $("#purchaseConfirm").on("click", async () => {
		let date = new Date($("#date").val());
		if (date == "Invalid Date" || date < Date.now()) {
			$("#date").addClass("is-invalid");
			$("#dateWarn").remove();
			$("#date").after(`<p class="text-danger" id="dateWarn">Некорректная дата</p>`);
			return;
		} else {
			$("#date").removeClass("is-invalid");
			$("#dateWarn").remove();
		}
		if ($("#address").val().length <= 1) {
			$("#address").addClass("is-invalid");
			$("#addressWarn").remove();
			$("#address").after(`<p class="text-danger m-0" id="addressWarn">Некорректный адрес</p>`);
		}
		if ($("#address").hasClass("is-invalid")) {
			return;
		}

		let res = await createOrder($("#date").val(), $("#address").val());

		if (res !== null && res.status === "Error") {
			$("#purchaseConfirmWarn").remove();
			$("#purchaseConfirm").after(`<p class="text-danger m-0" id="purchaseConfirmWarn">${res.message}</p>`);
		} else {
			$("#purchaseConfirmWarn").remove();
			router.dispatch("/orders", "");
		}
	});
}

async function showItems(dishes, template) {
	let container = $("#dishList");
	let price = 0;
	await dishes.forEach(async (curr) => {
		let newItem = await itemSetup($(template), curr);
		price += curr.totalPrice;
		container.append(newItem);
	});
	$("#totalPrice").html(`<span class="fw-bold">Стоимость заказа: </span>${price}руб.`);
}

export async function itemSetup(newItem, currentItem) {
	newItem.find(".name").text(currentItem.name);
	newItem.find(".image").attr("src", currentItem.image);
	newItem.find(".amount").text(`Количество: ${currentItem.amount}шт.`);
	newItem.find(".cost").text(`Цена: ${currentItem.price}руб.`);
	newItem.find(".fullPrice").html(`<span class="fw-bold">Стоимость: </span>${currentItem.totalPrice}руб.`);

	return newItem;
}
