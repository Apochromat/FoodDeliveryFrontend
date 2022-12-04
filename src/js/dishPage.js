import {checkRating, setRating, getDish} from "/src/js/dishAPI.js"

export async function initDishPage(args, router) {
    $.appear("#dish-container", 700);

    let dishJSON = await getDish(args[0]);
	if (dishJSON === null || dishJSON.status === "Error") {
		router.dispatch("/404", "");
		return;
	}

    let token = localStorage.getItem("jwt");
    if (token) {
        let rating = await checkRating(args[0]);
        await setupDish(dishJSON, !rating);
    }
    else {
        await setupDish(dishJSON);
    }
}

async function setupDish(args, ratingFixed = true) {
    $("#name").text(args.name);
    $("#image").attr("src", args.image);
    $("#category").text(`Категория блюда - ${args.category}`);
    $("#rating").rating({displayOnly: ratingFixed, step: 1, size:"md"});
    $("#rating").rating('update', args.rating);
    $("#desc").text(args.description);
    $("#cost").text(`Цена: ${args.price}руб./шт`);
    $("#vegetarian").text(`${args.vegetarian ? "Вегетерианское" : "Не вегетерианское"} блюдо`)


    if (args.vegetarian) {
        $("#vegetarianIcon").toggleClass("d-none", false)
    }

    $('#rating').on('rating:change', async function(event, value, caption) {
        await setRating(args.id, value);
    });

    return;
}