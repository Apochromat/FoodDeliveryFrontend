import { addBasket, deleteBasket, getBasket, countBasket } from "/src/js/basketAPI.js";

export async function initBasketPage() {
    $.appear("#basket-container", 700);

	let basketJSON = await getBasket();
	if (basketJSON === null || basketJSON.length === 0) {
        $("#basket-container").empty();
		$.get("/src/views/notFoundBasket.html", function (data) {
			let basketContainer = $("#basket-container");
			basketContainer.append(data);
		});
		return;
	}
	$.get("/src/views/basketCard.html", function (data) {
		showItems(basketJSON, data);
	});
}

async function showItems(basketJSON, template) {
	let basketContainer = $("#basket-container");
	basketJSON.forEach(async (curr) => {
		let newItem = await itemSetup($(template), curr);
		basketContainer.append(newItem);
	});
}

export async function itemSetup(newItem, currentItem) {
	newItem.find(".name").text(currentItem.name);
	newItem.find(".image").attr("src", currentItem.image);
	newItem.find(".cost").text(`Цена: ${currentItem.price}руб./шт`);
	newItem.find(".orderLabel").text(`${currentItem.amount}`);

	newItem.find(".increase").on("click", async (event) => {
		let token = localStorage.getItem("jwt");
		if (!token) return;
		let label = newItem.find(".orderLabel");
		let value = parseInt(label.text(), 10);
		value = isNaN(value) ? 0 : value;
		value++;
		label.text(`${value}`);
		await addBasket(currentItem.id);
		$("#basketBadge").text(`${await countBasket()}`);
	});

	newItem.find(".decrease").on("click", async (event) => {
		let token = localStorage.getItem("jwt");
		if (!token) return;
		let label = newItem.find(".orderLabel");
		let value = parseInt(label.text(), 10);
		if (value <= 1) {
			await deleteBasket(currentItem.id);
			$("#basketBadge").text(`${await countBasket()}`);
			location.reload();
		} else {
			value--;
			label.text(`${value}`);
			await deleteBasket(currentItem.id, true);
			$("#basketBadge").text(`${await countBasket()}`);
		}
	});

	newItem.find(".delete").on("click", async (event) => {
		let token = localStorage.getItem("jwt");
		if (!token) return;

		await deleteBasket(currentItem.id);
		$("#basketBadge").text(`${await countBasket()}`);
		newItem.remove();
		location.reload();
	});

	return newItem;
}
