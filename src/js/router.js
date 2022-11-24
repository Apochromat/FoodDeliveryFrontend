import { initMenu } from "/src/js/loadDishies.js";
import { setNavbar } from "/src/js/initNavbar.js";


let router = {
    routes: [
        { pattern: /^\/login$/, callback: "login", nav: [] },
        { pattern: /^\/register$/, callback: "register", nav: [] },
        { pattern: /^\/orders$/, callback: "orders", nav: ["ordersLink"] },
        { pattern: /^\/profile$/, callback: "profile", nav: ["profileLink"] },
        { pattern: /^\/item\/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/,
          callback: "item", nav: ["itemLink"] },
        { pattern: /^\/([0-9]*)$/, callback: "menu", nav: ["dishesLink"] }
    ],

    dispatch: function (path, pushHistory = true) {
        for (let i = 0; i < this.routes.length; ++i) {
            let args = path.match(this.routes[i].pattern);
            if (args) {
                if (!routerFunctions[this.routes[i].callback].apply(this, args.slice(1))) {
                    return;
                };
                $("main").empty();
                if (pushHistory) history.pushState({}, null, path);
                $(".me-auto a").removeClass("active");
                this.routes[i].nav.forEach(val => $(`#${val}`).addClass("active"));
                return;
            }
        }
        routerFunctions["default"]();
    },

    init: async function () {
        await setNavbar();
        $(document).on("click", function (event) {
            if (event.target.href != undefined) {
                event.preventDefault();
                let url = new URL(event.target.href);
                if (window.location.pathname != url.pathname) router.dispatch(url.pathname);
            }
        });
    },

    checkLogin: function () {
        let user = localStorage.getItem("user");
        return (user && JSON.parse(user).auth);
    }
}

let routerFunctions = {
    default: function() {
        $("main").load("/src/views/404.html");
    },

    menu: function(page = 1) {
        if (!page) page = 1;
        $("main").load("/src/views/dishesContainer.html", () => initMenu(page));
        return true;
    }

}

$(document).one("DOMContentLoaded", async function() {
    await router.init();
    router.dispatch(window.location.pathname);
});

$(window).on("popstate", function() {
    router.dispatch(window.location.pathname, false);
})
