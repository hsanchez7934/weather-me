import key from './key.js';
import './main.css';
import axios from 'axios';
import parseData from './parseData.js';
import mockData from '../test/mockData';

$('#submit-button').on('click', fetchWeatherDataOnClick);

function fetchWeatherDataOnClick() {
  $('#bottom-main').children().remove();
  const userInput = $('#user-input').val();
  const url = createUrl(userInput);
  fetchWeatherData(url);
  // const weatherData = parseData(mockData.list);
  // const city = mockData.city.name;
  // displayData(weatherData, city);
  $('#user-input').val("");
}

function createUrl(query) {
  let url;
  if (!isNaN(parseInt(query))) {
    url = `https://api.openweathermap.org/data/2.5/forecast?zip=${query},US&APPID=${key}`;
  } else if (isNaN(parseInt(query))) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${query},us&mode=json&APPID=${key}`;
  }
  return url;
}

async function fetchWeatherData(url) {
  try {
    let response = await axios.get(url);
    const weatherData = parseData(response.data.list);
    const city = response.data.city.name;
    displayData(weatherData, city);
  } catch (error) {
    $('#city-name').text(`Something went wrong. Try again...`);
  }
}

function displayData(weatherData, city) {
  $('#city-name').text(city);
  const section = $('#bottom-main');
  const fragment = $(document.createDocumentFragment());
  const listWrapper = $('<div></div>', {
    id: 'list-wrapper'
  });

  for (let day in weatherData) {
    let date = weatherData[day];
    let dateCard = $('<article></article>', {
      html: `Date: ${day}`
    });
    listWrapper.append(dateCard);

    for (let time in date) {
      let timeUl = $('<ul><li></li></ul>', {
        html: `Time: ${time}`
      })
        .find('li')
        .html(`Temp: ${date[time]}`)
        .end();
      dateCard.append(timeUl);
    }
  }
  fragment.append(listWrapper);
  section.append(fragment);
}
