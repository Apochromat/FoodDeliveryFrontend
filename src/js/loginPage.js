import { loginUser } from "/src/js/authAPI.js";
export function initLoginPage() {
    $.appear("#login-container", 700);

    $("#loginBtn").on("click", async () => {
        $("#login").prop("disabled", true);
        $("#password").prop("disabled", true);
        $("#loginBtn").addClass("disabled");
        try {
            let loginAttempt = await loginUser($("#login").val(), $("#password").val());
            if (loginAttempt) location.pathname = "/";
            else {
                $("#authWarn").remove();
                $("#loginBtn").before(`<p class="text-danger" id="authWarn">Неверные данные!</p>`);
            }
        }
        catch {
            alert("Ошибка соединения");
        }
        finally {
            $("#loginBtn").removeClass("disabled");
            $("#login").prop("disabled", false);
            $("#password").prop("disabled", false);
        }

    });
}