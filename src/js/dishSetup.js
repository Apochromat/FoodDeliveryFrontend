export function dishSetup(newDish, currentDish) {
    newDish.find(".card-title a").text(currentDish.name);
    newDish.find(".card-title a").attr("href", `/Dish/${currentDish.id}`);
    newDish.find("img").attr("src", currentDish.image);
    newDish.find(".category").text(`Категория блюда - ${currentDish.category}`);
    if (currentDish.rating === null) {
        newDish.find(".rating").text("Отзывов нет");
    } else {
        newDish.find(".rating").text(currentDish.rating);
    }
    newDish.find(".desc").text(currentDish.description);
    newDish.on("click", event => {
        if ($(event.target).prop("tagName") != "BUTTON") newDish.find("a")[0].click();
    });

    return newDish;
}