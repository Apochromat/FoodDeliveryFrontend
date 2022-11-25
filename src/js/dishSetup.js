export function dishSetup(newDish, currentDish) {
    newDish.find(".card-title a").text(currentDish.name);
    newDish.find(".card-title a").attr("href", `/Dish/${currentDish.id}`);
    newDish.find(".imageDiv").attr("src", currentDish.image);
    newDish.find(".category").text(`Категория блюда - ${currentDish.category}`);
    newDish.find(".rating").rating({displayOnly: true, step: 1});
    newDish.find(".rating").rating('update', currentDish.rating);
    newDish.find(".desc").text(currentDish.description);
    newDish.find(".cost").text(`Цена - ${currentDish.price}`);

    if (currentDish.vegetarian) {
        newDish.find(".vegetarianIcon").toggleClass("d-none", false)
    }

    newDish.find(".orderButton").on("click", event => {
        newDish.find(".orderDecreaser").toggleClass("d-none", false)
        newDish.find(".orderButton").toggleClass("d-none", true)
    })

    newDish.find(".increase").on("click", event => {
        let label = newDish.find(".orderLabel");
        let value = parseInt(label.text(), 10);
	    value = isNaN(value) ? 0 : value;
	    value++;
        label.text(`${value}`);
    })

    newDish.find(".decrease").on("click", event => {
        let label = newDish.find(".orderLabel");
        let value = parseInt(label.text(), 10);
	    if (value <= 1) {
            newDish.find(".orderDecreaser").toggleClass("d-none", true)
            newDish.find(".orderButton").toggleClass("d-none", false)
        }
        else {
            value--;
            label.text(`${value}`);
        }
    })

    // newDish.on("click", event => {
    //     if ($(event.target).prop("tagName") != "BUTTON") newDish.find("a")[0].click();
    // });

    return newDish;
}