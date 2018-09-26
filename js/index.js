let tempC, tempF, city;
let tempUnit = 'F';

// Convert temperature between F & C
function convertTemp() {
  if (tempUnit === 'F') {
    $('#convertBtn').text('Convert C to F');
    $('.temperature').text(`It's ${tempC}°C in ${city}`);
    tempUnit = 'C';
    // Swap F and C values
  } else {
    $('#convertBtn').text('Convert F to C');
    $('.temperature').text(`It's ${tempF}°F in ${city}`);
    tempUnit = 'F';
  }
}

// Display error message
function displayError(err) {
  $('.loading').hide();
  const message = (err)
    ? 'Could not detect your location, so there is no weather to report.'
    : 'Could not load weather data. Please try again later.';
  $('.wx-container').after(message);
}

// Change GUI for night colors
function nightView() {
  $('.main').css(
    'background',
    '#222 url("https://rvrvrv.github.io/img/paperDark.jpg")'
  );
  $('.main').css('color', '#ddf');
  $('#arrow').css('filter', 'invert(100%)');
  $('#nightBtn').css('display', 'none');
}

// Get weather from OpenWeatherMap API
function getWx(apiURL) {
  $.getJSON(apiURL)
    .done((wx) => {
      tempC = Math.round(wx.main.temp - 273.15);
      tempF = Math.round(tempC * (9 / 5) + 32);
      const condIcon = `https://openweathermap.org/img/w/${wx.weather[0].icon}.png`;
      const windSpeed = Math.round(wx.wind.speed * 2.2369);
      const windDir = wx.wind.deg;
      city = wx.name;

      $('.temperature').text(`It's ${tempF}°F in ${city}`);
      $('.condition').html(`Current Condition: ${wx.weather[0].main}<img src=${condIcon} />`);
      $('.text-wind').text('Wind:');
      $('#windPic').append(`<br>${windSpeed} mph`);
      $('#humidity').text(`${wx.main.humidity}% humidity`);
      $('#pressure').text(`${wx.main.pressure} hPA`);

      // Hide loading message and display weather
      $('.loading').fadeOut(500, () => $('.wx-container').fadeIn(750));

      // Rotate arrow to point at correct wind direction
      setTimeout(() => {
        $('#arrow').css({
          WebkitTransform: `rotate(${Math.abs(180 - windDir)}deg)`
        });
        $('arrow').css({
          'moz-transform': `rotate(${Math.abs(180 - windDir)}deg)`
        });
      }, 750);

      // If nighttime, switch to night view
      if (wx.weather[0].icon.includes('n')) nightView();
      // If daytime, show night-view button
      else setTimeout(() => $('#nightBtn').fadeIn(), 3000);
    })
    .fail(() => displayError());
}

function handleLocation(loc) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&APPID=5409147afc24f8e2df831e426e107f34`;
  $('footer').append(`API URL: ${apiURL}<br>`);
  // Call get-weather function
  return getWx(apiURL);
}

$(document).ready(() => {
  // Temperature-conversion button
  $('#convertBtn').click(() => convertTemp());
  // Night-view button
  $('#nightBtn').click(() => nightView());
  // Request location
  navigator.geolocation.getCurrentPosition(handleLocation, () => displayError('denied'));
});
