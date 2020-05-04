//write a basic first test
const app = require('../src/app');
const { expect } = require('chai');
const supertest = require('supertest');

describe('App', () => {
    it('GET / movie responds with an array of JSON data from the movie API', () => {
        return supertest(app)
            .get('/movie')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.a('array');
            });
    } );
});
