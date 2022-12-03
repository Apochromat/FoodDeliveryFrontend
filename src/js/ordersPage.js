import { getBasket, countBasket } from "/src/js/basketAPI.js";
import { getOrders, getOrder, createOrder, confirmOrder } from "/src/js/orderAPI.js";
import { zero } from "/src/js/misc.js";


export async function initOrdersPage() {
	let orderJSON = await getOrders();
	if (orderJSON === null || orderJSON.length === 0) {
		$.get("/src/views/notFoundOrders.html", function (data) {
			let orderContainer = $("#order-container");
			orderContainer.append(data);
		});
	}
	else {
		$("#last-orders").toggleClass("d-none", false);
	}

	let basketJSON = await getBasket();
	if (basketJSON !== null && basketJSON.length !== 0) {
		$("#purchase").toggleClass("d-none", false);
	}

	$.get("/src/views/ordersCard.html", function (data) {
		showItems(orderJSON, data);
	});
}

async function showItems(basketJSON, template) {
	let basketContainer = $("#last-orders");
	basketJSON.forEach(async (curr) => {
		let newItem = await itemSetup($(template), curr);
		basketContainer.append(newItem);
	});
}

export async function itemSetup(newItem, currentItem) {
	let deliveryMessage = "";
	let date = new Date(currentItem.deliveryTime);
	const isToday = (someDate) => {
		const today = new Date()
		return someDate.getDate() == today.getDate() &&
		  someDate.getMonth() == today.getMonth() &&
		  someDate.getFullYear() == today.getFullYear()
	  }
	if (isToday(date)) {
		if (date - Date.now() <= 0) {
			deliveryMessage = `Доставлен: ${zero(date.getHours())}:${zero(date.getMinutes())}`;
		}
		else {
			deliveryMessage = `Доставка ожидается в ${zero(date.getHours())}:${zero(date.getMinutes())}`;
		}
	}
	else {
		if (date - Date.now() <= 0) {
			deliveryMessage = `Доставлен: ${zero(date.getDate())}.${zero(date.getMonth())}.${date.getFullYear()} ${zero(date.getHours())}:${zero(date.getMinutes())}`;
		}
		else {
			deliveryMessage = `Доставка ожидается: ${zero(date.getDate())}.${zero(date.getMonth())}.${date.getFullYear()} ${zero(date.getHours())}:${zero(date.getMinutes())}`;
		}
	}

	if (currentItem.status !== "InProcess") {
		newItem.find(".confirm").toggleClass("d-none", true);
		newItem.find(".orderButt").toggleClass("justify-content-between", false);
		newItem.find(".orderButt").toggleClass("justify-content-end", true);
	}

	newItem.find(".title a").text(`Заказ от ${currentItem.orderTime.slice(0, 10).replace("-", ".").replace("-", ".")}`);
	newItem.find(".title a").attr("href", `/order/${currentItem.id}`);
	newItem.find(".status").text(`Статус заказа: ${currentItem.status === "InProcess" ? "В обработке" : "Доставлен"}`);
	newItem.find(".delivery").text(deliveryMessage);
	newItem.find(".cost").html(`<span class="fw-bold">Стоимость заказа: </span>${currentItem.price}руб.`);

	newItem.find(".confirm").on("click", async (event) => {
		let token = localStorage.getItem("jwt");
		if (!token) return;
		await confirmOrder(currentItem.id);
		location.reload()
	});

	newItem.on("click", (event) => {
		if ($(event.target).prop("tagName") != "BUTTON") newItem.find("a")[0].click();
	});

	return newItem;
}
