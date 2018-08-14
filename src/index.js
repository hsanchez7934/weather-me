import key from './key.js';
import './main.css';
import axios from 'axios';
import { parseData, createGraphData } from './cleanerFunctions.js';
import * as d3 from 'd3';
import kelvinToFahrenheit from 'kelvin-to-fahrenheit';

$('#submit-button').on('click', fetchWeatherDataOnClick);

function fetchWeatherDataOnClick() {
  $('#bottom-main').children().remove();
  $('#graph-container').children().remove();
  const userInput = $('#user-input').val();
  if (userInput === "") {
    $('#city-name').text('Enter city name or zip code.');
    return;
  }
  const url = createUrl(userInput);
  fetchWeatherData(url);
  $('#user-input').val("");
}

function createUrl(query) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?`;
  if (!isNaN(parseInt(query))) {
    url = url + `zip=${query},US&APPID=${key}`;
  } else if (isNaN(parseInt(query))) {
    url = url + `q=${query},us&mode=json&APPID=${key}`;
  }
  return url;
}

async function fetchWeatherData(url) {
  try {
    let response = await axios.get(url);
    const fiveDayData = parseData(response.data.list);
    const chartData = createGraphData(response.data.list);
    const city = response.data.city.name;
    displayData(fiveDayData, city);
    createGraph(chartData);
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
    for (let time in date) {
      let ul = $('<ul></ul>', {
        html: `Time: ${time}`,
        class: 'time-ul'
      });
      let li = $('<li></li>', {
        html: `Temp: ${date[time]}`,
        class: 'time-li'
      });
      ul.append(li);
      dateCard.append(ul);
    }
    listWrapper.append(dateCard);
  }

  fragment.append(listWrapper);
  section.append(fragment);
}

function createGraph(data) {
  const svgWidth = 900, svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const chart = d3.select('#graph-container').append('svg');

  chart.attr('width', svgWidth).attr('height', svgHeight);

  const group = chart.append('g')
    .attr('transform', "translate("+ margin.left +","+ margin.top +")");

  const x = d3.scaleTime().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const line = d3.line().x(d => x(d.date)).y(d => y(d.temp));
  x.domain(d3.extent(data, d => d.date));
  y.domain(d3.extent(data, d => d.temp));

  group.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .select(".domain")
    .remove();

  group.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Temperature Fahrenheit");

  group.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}
