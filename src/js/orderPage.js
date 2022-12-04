import { getOrder, confirmOrder } from "/src/js/orderAPI.js";
import { zero } from "/src/js/misc.js";

export async function initOrderPage(id, router) {
    $.appear("#order-container", 700);

	let orderJSON = await getOrder(id);
	if (orderJSON === null) {
		router.dispatch("/404", "");
		return;
	}

	let orderTime = new Date(orderJSON.orderTime);
	let deliveryTime = new Date(orderJSON.deliveryTime);

	$("#orderDate").text(`Дата заказа: ${zero(orderTime.getDate())}.${zero(orderTime.getMonth())}.${orderTime.getFullYear()} ${zero(orderTime.getHours())}:${zero(orderTime.getMinutes())}`);
	$("#deliveryDate").text(`Дата доставки: ${zero(deliveryTime.getDate())}.${zero(deliveryTime.getMonth())}.${deliveryTime.getFullYear()} ${zero(deliveryTime.getHours())}:${zero(deliveryTime.getMinutes())}`);
	$("#address").text(`Адрес доставки: ${orderJSON.address}`);
	$("#status").text(`Статус заказа: ${orderJSON.status === "InProcess" ? "В обработке" : "Доставлен"}`);
	$("#totalPrice").html(`<span class="fw-bold">Стоимость заказа: </span>${orderJSON.price}руб.`);

	if(orderJSON.status !== "InProcess"){
		$("#confirm").toggleClass("d-none", true);
	}

	$("#confirm").on("click", async (event) => {
		let token = localStorage.getItem("jwt");
		if (!token) return;
		await confirmOrder(orderJSON.id);
		location.reload()
	});

	$.get("/src/views/orderDishCard.html", function (data) {
		showItems(orderJSON.dishes, data);
	});
}

async function showItems(dishes, template) {
	let container = $("#dishList");
	dishes.forEach(async (curr) => {
		let newItem = await itemSetup($(template), curr);
		container.append(newItem);
	});
}

export async function itemSetup(newItem, currentItem) {
	newItem.find(".name").text(currentItem.name);
	newItem.find(".image").attr("src", currentItem.image);
	newItem.find(".amount").text(`Количество: ${currentItem.amount}шт.`);
	newItem.find(".cost").text(`Цена: ${currentItem.price}руб.`);
	newItem.find(".fullPrice").html(`<span class="fw-bold">Стоимость заказа: </span>${currentItem.totalPrice}руб.`);

	return newItem;
}
