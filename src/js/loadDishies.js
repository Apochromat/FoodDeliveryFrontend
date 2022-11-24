import { dishSetup } from "/src/js/dishSetup.js"

export async function getDishes(page) {
    var url = new URL(`${api_url}/dish`)
    var params = {page:page}
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url);
    if (response.ok) {
        let json = await response.json();
        return json;
    } else {
        return new Object();
    }
}

export async function initMenu(page) {
    if (page < 0) return;
    let dishesJSON = await getDishes(page);
    let dishes = dishesJSON.dishes;
    let pages = dishesJSON.pagination;
    if (pages.count < 1) return;
    if (page > pages.count) {
        history.pushState({}, null, `/${pages.count}`);
        initMenu(pages.count);
        return;
    }
    $.get("/src/views/dishItem.html", function(data) {
        showDishes(dishes, page, data, pages.count);
    });
}

 async function showDishes(dishes, page, dishTemplate, pages) {
    let dishesContainer = $("#dishes-container");
    dishes.forEach((curr) => {
        let newDish = dishSetup($(dishTemplate), curr);
        dishesContainer.append(newDish);
    })
    $(".dishItem").fadeOut(0).slideDown("normal");
    $.get("/src/views/pagination.html", function(data) {
        showPagination(page, data, pages);
    })
}

async function showPagination(page, pagination, pages) {
    let pagesElement = $(pagination);
    if (page <= 1) pagesElement.find("#back").addClass("disabled");
    if (page >= pages) pagesElement.find("#forward").addClass("disabled");

    pagesElement.find("#back").attr("href", `/1`);
    pagesElement.find("#forward").attr("href", `/${pages}`);

    let page1 = pagesElement.find("#page1");
    let page2 = pagesElement.find("#page2");
    let page3 = pagesElement.find("#page3");
    if (pages == 1) {
        page2.remove();
        page3.remove();
        page1.text("1").addClass("active").attr("href", "/1");
    }
    else if (pages == 2) {
        page3.remove();
        page1.text("1").attr("href", "/1");
        page2.text("2").attr("href", "/2");
        page == 1 ? page1.addClass("active") : page2.addClass("active");
    }
    else {
        let firstValue = page - 1;
        let activePage = 2;
        if (page <= 3) {
            firstValue = 1;
            activePage = page;
        }
        else if (page == pages) {
            firstValue = pages - 2;
            activePage = 3;
        }
        page1.text(firstValue).attr("href", `/${firstValue}`);
        page2.text(firstValue + 1).attr("href", `/${firstValue + 1}`);
        page3.text(firstValue + 2).attr("href", `/${firstValue + 2}`);
        pagesElement.find(`#page${activePage}`).addClass("active");
    }
    $("#dishes-container").after(pagesElement);
}