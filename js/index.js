/*jshint browser: true, esversion: 6*/
/* global $*/
let tempC, tempF, city, state;
let tempUnit = 'F';

$(document).ready(function () {
	//Get location from FreeGeoIP
	$.getJSON('https://freegeoip.net/json/')
		.done(data => {
			city = data.city;
			state = data.region_code;
			let apiURL = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&APPID=5409147afc24f8e2df831e426e107f34`;
			$('footer').append(`API URL: ${apiURL}<br>`);
			//Call get-weather function
			getWx(apiURL);
		})
		.fail(() => displayError('location'));

	//Temperature-conversion button
	$('#convertBtn').click(() => convertTemp());
	//Night-view button
	$('#nightBtn').click(() => nightView());
});

//Get weather from OpenWeatherMap
function getWx(apiURL) {
	$.getJSON(apiURL)
		.done(wx => {
			tempC = Math.round(wx.main.temp - 273.15);
			tempF = Math.round(tempC * (9 / 5) + 32);
			let condIcon = `https://openweathermap.org/img/w/${wx.weather[0]
        .icon}.png`;
			let windSpeed = Math.round(wx.wind.speed * 2.2369);
			let windDir = wx.wind.deg;

			$('.temperature').html(`It's ${tempF}°F in ${city}, ${state}.`);
			$('.condition').html(
				`Current Condition: ${wx.weather[0].main}<img src=${condIcon} alt='Current condition'>`
			);
			$('#windText').html('Wind:');
			$('#windPic').append(`<br>&nbsp;&nbsp;${windSpeed} mph`);
			$('#humidity').html(`${wx.main.humidity}% humidity`);
			$('#pressure').html(`${wx.main.pressure} hPA`);

			//Hide loading message and display weather
			$('.loading').fadeOut(500, () => $('.wx-container').fadeIn(750));

			//Rotate arrow to point at correct wind direction
			setTimeout(() => {
				$('#arrow').css({
					WebkitTransform: `rotate(${Math.abs(180 - windDir)}deg)`
				});
				$('arrow').css({
					'moz-transform': `rotate(${Math.abs(180 - windDir)}deg)`
				});
			}, 750);

			//If nighttime, switch to night view
			if (wx.weather[0].icon.includes('n')) nightView();
			else
				//If daytime, show night-view button
				setTimeout(() => $('#nightBtn').fadeIn(), 3000);
		})
		.fail(() => displayError());
}

//Convert temperature between F & C
function convertTemp() {
	if (tempUnit === 'F') {
		$('#convertBtn').text('Convert C to F');
		$('.temperature').html(`It's ${tempC}°C in ${city}, ${state}.`);
		tempUnit = 'C';
		//SWAP F and C values
	} else {
		$('#convertBtn').text('Convert F to C');
		$('.temperature').html(`It's ${tempF}°F in ${city}, ${state}.`);
		tempUnit = 'F';
	}
}

//Change GUI for night colors
function nightView() {
	$('.main').css(
		'background',
		'#222 url("https://rvrvrv.github.io/img/paperDark.jpg")'
	);
	$('.main').css('color', '#ddf');
	$('#arrow').css('filter', 'invert(100%)');
	$('#nightBtn').css('display', 'none');
}

//Display error message
function displayError(err) {
	$('.loading').hide();
	if (err === 'location')
		$('.wx-container').after(
			'Could not detect your location. Please try again on a different device.'
		);
	else
		$('.wx-container').after(
			'Could not load weather data. Please try again later.'
		);
}
