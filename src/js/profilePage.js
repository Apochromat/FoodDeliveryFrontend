import { getProfileDetails, changeProfile } from "/src/js/profileAPI.js";
export async function initProfilePage() {
    $.appear("#profile-container", 700);

    IMask(document.getElementById("inputPhone"), {
		mask: "+{7} (000) 000-00-00"
	});
    IMask(document.getElementById("inputName"), {
		mask: /^[а-яА-ЯёЁa-zA-Z\- ]+$/
	});
    IMask(document.getElementById("inputAddress"), {
		mask: /^[а-яА-ЯёЁa-zA-Z0-9.,\- ]+$/
	});

    let details = await getProfileDetails();

    let checkName = () => {
		let name = $("#inputName").val();
		let lengthCheck = true;
		if (name.length < 4 || name.length > 64) lengthCheck = false;
		if (!lengthCheck) {
			$("#inputName").addClass("is-invalid");
			let text = "Длина имени от 4 до 64 символов";
			$("#inputNameWarn").remove();
			$("#inputName").after(`<p class="text-danger" id="inputNameWarn">${text}</p>`);
			return false;
		} else {
			$("#inputName").removeClass("is-invalid");
			$("#inputNameWarn").remove();
			return true;
		}
	};
    $("#inputName").on("change", checkName);

    let checkBirthday = () => {
        let date = new Date($("#inputBirth").val());
        if (date == "Invalid Date" || date > Date.now() || date < new Date("1900-01-01")) {
            $("#inputBirth").addClass("is-invalid");
            $("#inputBirthWarn").remove();
            $("#inputBirth").after(`<p class="text-danger" id="inputBirthWarn">Некорректная дата</p>`);
            return false;
        }
        else {
            $("#inputBirth").removeClass("is-invalid");
            $("#inputBirthWarn").remove();
            return true;
        }
    }
    $("#inputBirth").on("change", checkBirthday);
    $("#inputBirth").attr("max", new Date().toISOString().split("T")[0]);

    $("#staticEmail").val(details.email);
    $("#inputName").val(details.fullName);
    $("#inputAddress").val(details.address);
    $("#inputPhone").val(details.phoneNumber);
    $("#staticGender").val(details.gender);
    $("#inputBirth").val(details.birthDate.slice(0, 10));

    let saveProfile = async () => {
        try {
            if (!checkName() || !checkBirthday()) return;

            $("#editProfileBtn").addClass("disabled");
            $("input, select").prop("disabled", true);
            let editProfileAttempt = await changeProfile($("#inputName").val(), $("#inputBirth").val(), $("#staticGender").val(), $("#inputAddress").val() === "" ? null : $("#inputAddress").val(), $("#inputPhone").val() === "" ? null : $("#inputPhone").val());
            if (editProfileAttempt) location.reload();
            else {
                $("#editWarn").remove();
                $("#editProfileBtn").before(`<p class="text-danger" id="editWarn">Ошибка!</p>`);
            }
        }
        catch(err) {
            throw err;
        }
        finally {
            $("#editProfileBtn").removeClass("disabled");
            $("input, select").prop("disabled", false);
        }
    }

    let editBtn = $("#editProfileBtn");
    editBtn.one("click", () => {
        $("input, select").attr("disabled", false);
        $("#editProfileBtn").removeClass("btn-warning").addClass("btn-primary").text("Сохранить");
        editBtn.on("click", saveProfile);
    }) 
}
