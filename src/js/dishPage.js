import {checkRating, setRating} from "/src/js/orders.js"

export async function getDish(id) {
	var url = new URL(`${api_url}/dish/${id}`);
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
}

export async function initDishPage(page, args, router) {
    let dishJSON = await getDish(args[0]);
	if (dishJSON === null) {
		router.dispatch("/404", "");
		return;
	}

    let token = localStorage.getItem("jwt");
    if (token) {
        let ratingJSON = await checkRating(args[0]);
        await setupDish(page, dishJSON, ratingJSON);
    }
    else {
        await setupDish(page, dishJSON);
    }
}

export async function setupDish(page, args, ratingFixed = true) {

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

    return page;
}