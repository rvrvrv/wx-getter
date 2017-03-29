/*jshint browser: true, esversion: 6*/
/* global $*/
$(document).ready(function() {

	var tempC, tempF, city, state;
	var tempUnit = 'F';

	//Check for HTTP/HTTPS
	if (window.location.href.match('https:')) {
		$('.warningBox').show();
		$('.opaque').show();
	}

	// Get location from ip-api
	$.getJSON('http://ip-api.com/json', (data) => {
		var lat = data.lat;
		var lon = data.lon;
		city = data.city;
		state = data.regionName;
		var apiURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=5409147afc24f8e2df831e426e107f34`;
		$('footer').append(`API URL: ${apiURL}<br>`);

		//actual get-weather code
		$.getJSON(apiURL, function (getWx) {
			tempC = Math.round(getWx.main.temp - 273.15);
			tempF = Math.round((tempC * (9 / 5)) + 32);
			let cond = getWx.weather[0].main;
			let condIcon = `http://openweathermap.org/img/w/${getWx.weather[0].icon}.png`;
			let humidity = getWx.main.humidity;
			let pressure = getWx.main.pressure;
			let windSpeed = Math.round(getWx.wind.speed * 2.2369);
			let windDir = getWx.wind.deg;

			$('.temperature').html(`It's ${tempF}°F in ${city}, ${state}.`);
			$('.condition').html(`Current Condition: ${cond}<img src=${condIcon} />`);
			$('#windText').html('Wind:');
			$('#windPic').append(`<br>&nbsp;&nbsp;${windSpeed} mph`);
			$('#humidity').html(`${humidity}% humidity`);
			$('#pressure').html(`${pressure} hPA`);

			//Rotate arrow to point in correct wind direction
			$('#arrow').css({
				WebkitTransform: `rotate(${Math.abs(180 - windDir)}deg)`
			});
			$('#arrow').css({
				'-moz-transform': `rotate(${Math.abs(180 - windDir)}deg)`
			});

			//If nighttime, adjust colors
			if (getWx.weather[0].icon.includes('n')) nightView();
			//If daytime, show night button
			else setTimeout(() => $('#nightBtn').show(), 3000);
		});
	});

	//F<->C conversion
	$('#convertBtn').click(function () {
		if (tempUnit === 'F') {
			$(this).text('Convert C to F');
			$('.temperature').html(`It's ${tempC}°C in ${city}, ${state}.`);
			tempUnit = 'C';
			//SWAP F and C values
		} else {
			$(this).text('Convert F to C');
			$('.temperature').html(`It's ${tempF}°F in ${city}, ${state}.`);
			tempUnit = 'F';
		}
	});

	//When clicked, update to night colors
	$('#nightBtn').click(() => nightView());

	//Change GUI for night colors
	function nightView() {
		$('.main').css('background-image', 'url("http://i67.tinypic.com/2z9k70p.jpg")');
		$('.main').css('color', '#DDDDFF');
		$('#arrow').css('filter', 'invert(100%)');
		$('#nightBtn').css('display', 'none');
	}

});
