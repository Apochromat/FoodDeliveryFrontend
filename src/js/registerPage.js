import { registerUser } from "/src/js/auth.js";

export function initRegisterPage() {
	IMask(document.getElementById("phone"), {
		mask: "+{7} (000) 000-00-00"
	});
    IMask(document.getElementById("password"), {
		mask: /^[a-zA-Z0-9\-_!@#№$%^&?*+=(){}[\]<>~]+$/
	});
    IMask(document.getElementById("name"), {
		mask: /^[а-яА-ЯёЁa-zA-Z ]+$/
	});
    IMask(document.getElementById("address"), {
		mask: /^[а-яА-ЯёЁ0-9.,\- ]+$/
	});


	$("#signUpBtn").on("click", async () => {
		let email = $("#email").val();
		let pass = $("#password").val();
		let name = $("#name").val();
		let birth = $("#birthday").val();
		let phone = $("#phone").val();
		let sex = $("#gender").val();
		let address = $("#address").val();

		let checks = [checkPassword(), checkName(), checkEmail(), checkBirthday(), checkPhone()];
		try {
			for (let i = 0; i < checks.length; ++i) {
				if (!checks[i]) return;
			}
			$("#signUpBtn").addClass("disabled");
			$("input, select").prop("disabled", true);
			let regAttempt = await registerUser(email, pass, name, address, phone, birth, sex);
			if (regAttempt.ok) location.href = "/";
			else {
				$("#regWarn").remove();
				$("#signUpBtn").before(`<p class="text-danger" id="regWarn">${regAttempt.msg}</p>`);
			}
		} catch {
			alert("Ошибка соединения");
		} finally {
			$("#signUpBtn").removeClass("disabled");
			$("input, select").prop("disabled", false);
		}
	});

	let checkPassword = () => {
		let pass = $("#password").val();
		let lengthCheck = true,
			numberCheck = true;
		if (pass.length < 8 || pass.length > 64) lengthCheck = false;
		if (!pass.match(/[0-9]+/g)) numberCheck = false;
		if (!lengthCheck || !numberCheck) {
			$("#password").addClass("is-invalid");
			let text = lengthCheck ? "Пароль должен включать цифры" : "Длина пароля от 8 до 64 символов";
			$("#passWarn").remove();
			$("#password").after(`<p class="text-danger" id="passWarn">${text}</p>`);
			return false;
		} else {
			$("#password").removeClass("is-invalid");
			$("#passWarn").remove();
			return true;
		}
	};
	$("#password").on("change", checkPassword);

	let checkPhone = () => {
		let phone = $("#phone").val();
		let matchCheck = true;
		if (!phone.match(/\+7 \([0-9]{3}\) [0-9]{3}\-[0-9]{2}\-[0-9]{2}/g)) matchCheck = false;
		if (!matchCheck) {
			$("#phone").addClass("is-invalid");
			let text = "Некорректный номер телефона";
			$("#phoneWarn").remove();
			$("#phone").after(`<p class="text-danger" id="phoneWarn">${text}</p>`);
			return false;
		} else {
			$("#phone").removeClass("is-invalid");
			$("#phoneWarn").remove();
			return true;
		}
	};
	$("#phone").on("change", checkPhone);


    let checkName = () => {
		let name = $("#name").val();
		let lengthCheck = true;
		if (name.length < 4 || name.length > 64) lengthCheck = false;
		if (!lengthCheck) {
			$("#name").addClass("is-invalid");
			let text = "Длина имени от 4 до 64 символов";
			$("#nameWarn").remove();
			$("#name").after(`<p class="text-danger" id="nameWarn">${text}</p>`);
			return false;
		} else {
			$("#name").removeClass("is-invalid");
			$("#nameWarn").remove();
			return true;
		}
	};
	$("#name").on("change", checkName);


	let checkEmail = () => {
		let email = $("#email").val();
		if (!email.match(/^\S+@\S+\.\S+$/)) {
			$("#email").addClass("is-invalid");
			let text = "Некорректный email";
			$("#emailWarn").remove();
			$("#email").after(`<p class="text-danger" id="emailWarn">${text}</p>`);
			return false;
		} else {
			$("#email").removeClass("is-invalid");
			$("#emailWarn").remove();
			return true;
		}
	};
	$("#email").on("change", checkEmail);

	let checkBirthday = () => {
		let date = new Date($("#birthday").val());
		if (date == "Invalid Date" || date > Date.now() || date < new Date("1900-01-01")) {
			$("#birthday").addClass("is-invalid");
			$("#birthdayWarn").remove();
			$("#birthday").after(`<p class="text-danger" id="birthdayWarn">Некорректная дата</p>`);
			return false;
		} else {
			$("#birthday").removeClass("is-invalid");
			$("#birthdayWarn").remove();
			return true;
		}
	};
	$("#birthday").on("change", checkBirthday);

	$("#birthday").attr("max", new Date().toISOString().split("T")[0]);
}
