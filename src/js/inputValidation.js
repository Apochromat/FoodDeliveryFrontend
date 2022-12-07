export function run() {
	ymaps.ready(init);
}

function init() {
	// Подключаем поисковые подсказки к полю ввода.
	let el = document.getElementById("address");
	var suggestView = new ymaps.SuggestView(el),
		map,
		placemark;

	// При клике по кнопке запускаем верификацию введёных данных.
	$("#address").on("input focus blur enterKey", function (e) {
		$("#address").val($("#address").val().trim());
		geocode();
	});
	$("#address").keyup(function (e) {
		if (e.keyCode == 13) {
			$("#address").val($("#address").val().trim());
			geocode();
		}
	});

	function geocode() {
		// Забираем запрос из поля ввода.
		var request = $("#address").val();
		if (request.length <= 1) {
			return;
		}
		// Геокодируем введённые данные.
		ymaps.geocode(request).then(
			function (res) {
				var obj = res.geoObjects.get(0),
					error,
					hint;

				if (obj) {
					// Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
					switch (obj.properties.get("metaDataProperty.GeocoderMetaData.precision")) {
						case "exact":
							break;
						case "number":
						case "near":
						case "range":
							error = "Неточный адрес, требуется уточнение";
							hint = "Уточните номер дома";
							break;
						case "street":
							error = "Неполный адрес, требуется уточнение";
							hint = "Уточните номер дома";
							break;
						case "other":
						default:
							error = "Неточный адрес, требуется уточнение";
							hint = "Уточните адрес";
					}
				} else {
					error = "Адрес не найден";
					hint = "Уточните адрес";
				}

				// Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
				if (error) {
					showError(hint);
				} else {
					$("#map").toggleClass("d-none", false);
					$("#address").removeClass("is-invalid");
					$("#addressWarn").remove();
					showResult(obj);
				}
			},
			function (e) {
				console.log("Повторите попытку");
				$("#map").toggleClass("d-none", true);
				$("#address").removeClass("is-invalid");
				$("#addressWarn").remove();
				run();
			}
		);
	}

	function showError(message) {
		$("#map").toggleClass("d-none", true);
		$("#address").addClass("is-invalid");
		$("#addressWarn").remove();
		$("#address").after(`<p class="text-danger m-0" id="addressWarn">${message}</p>`);
		if (map) {
			map.destroy();
			map = null;
		}
	}

	function showResult(obj) {
		// Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
		var mapContainer = $("#map"),
			bounds = obj.properties.get("boundedBy"),
			// Рассчитываем видимую область для текущего положения пользователя.
			mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [mapContainer.width(), mapContainer.height()]),
			// Сохраняем полный адрес для сообщения под картой.
			address = [obj.getCountry(), obj.getAddressLine()].join(", "),
			// Сохраняем укороченный адрес для подписи метки.
			shortAddress = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(" ");
		// Убираем контролы с карты.
		mapState.controls = [];
		// Создаём карту.
		createMap(mapState, shortAddress);
	}

	function createMap(state, caption) {
		// Если карта еще не была создана, то создадим ее и добавим метку с адресом.
		if (!map) {
			map = new ymaps.Map("map", state);
			placemark = new ymaps.Placemark(
				map.getCenter(),
				{
					iconCaption: caption,
					balloonContent: caption,
				},
				{
					preset: "islands#redDotIconWithCaption",
				}
			);
			map.geoObjects.add(placemark);
			// Если карта есть, то выставляем новый центр карты и меняем данные и позицию метки в соответствии с найденным адресом.
		} else {
			map.setCenter(state.center, state.zoom);
			placemark.geometry.setCoordinates(state.center);
			placemark.properties.set({ iconCaption: caption, balloonContent: caption });
		}
	}
}
