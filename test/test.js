const jsdom = require('mocha-jsdom');
import {expect} from 'chai';
import mockData from './mockData.js';
import setup from './setup';
import { parseData } from '../src/cleanerFunctions';
const server = require('../server.js');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const environment = process.env.NODE_ENV || 'test';

chai.use(chaiHttp);

describe('parseDataFunction', () => {

  let weatherData;
  beforeEach(() => {
    weatherData = mockData.list;
  });

  it(`parseData function should clean data and return expected object`, () => {
    const expected = {
      '2018-08-08': {
        '18:00:00': '85.59 F',
        '21:00:00': '84.24 F'
      },
      '2018-08-09': {
        '03:00:00': '66.06 F',
        '06:00:00': '55.84 F',
        '09:00:00': '53.2 F',
        '12:00:00': '50.55 F',
        '15:00:00': '71.24 F',
        '18:00:00': '78.83 F',
        '21:00:00': '79.4 F'
      },
      '2018-08-10': {
        '03:00:00': '66.98 F',
        '06:00:00': '62.27 F',
        '09:00:00': '58.14 F',
        '12:00:00': '53.88 F',
        '15:00:00': '70.87 F',
        '18:00:00': '78.21 F',
        '21:00:00': '80.57 F'
      },
      '2018-08-11': {
        '03:00:00': '65.69 F',
        '06:00:00': '58.52 F',
        '09:00:00': '55.27 F',
        '12:00:00': '50.66 F',
        '15:00:00': '68.9 F',
        '18:00:00': '79.49 F',
        '21:00:00': '82.24 F'
      },
      '2018-08-12': {
        '03:00:00': '68.08 F',
        '06:00:00': '61.57 F',
        '09:00:00': '57.05 F',
        '12:00:00': '51.85 F',
        '15:00:00': '69.46 F',
        '18:00:00': '79.95 F',
        '21:00:00': '85.13 F'
      },
      '2018-08-13': {
        '03:00:00': '70.95 F',
        '06:00:00': '64.31 F',
        '09:00:00': '61 F',
        '12:00:00': '55 F'
      }
    };

    const result = parseData(weatherData);

    expect(result).to.be.a('object');
    expect(result).to.deep.equal(expected);
  });
});

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server).get('/').then(response => {
      response.should.have.status(200);
      response.should.be.html;
    }).catch(error => {
      throw error;
    });
  });

  it(`should return 404 error for nonexistent route`, () => {
    return chai.request(server).get('/nonexistentroute').then(response => {
      response.should.have.status(404);
    }).catch(error => {
      throw error;
    });
  });

});
