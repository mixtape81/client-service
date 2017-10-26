/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */

import supertest from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import db from '../database/database';
import createLocations from '../data/locations';
import createUsers from '../data/users';

const request = supertest.agent(app);
const port = 7357;

let server;
let cities;
let users;

const testPost = () => {
  const location = {
    name: 'San Francisco'
  };
  const user = {
    joinDate: new Date(),
    age: 25,
    paidStatus: true,
    genreGroup: 3,
    favoriteArtists: [4, 2, 6, 8],
    favoriteGenres: [1, 67, 21, 2],
    locationId: 1
  };

  return db.Location.create(location)
    .then(() => db.User.create(user))
    .catch(err => console.error(err));
};
describe('', function () {
  beforeEach(function (done) {
    server = app.listen(port);
    db.User.drop()
      .then(() => db.Location.drop())
      .then(() => db.Location.sync({ force: true }))
      .then(() => db.User.sync({ force: true }))
      .then(() => done());

    afterEach(() => server.close());

    after(() => {
      db.User.drop()
        .then(() => db.Location.drop());
    });
  });

  describe('Client Server', function () {
    it('Should reject GET requests', function (done) {
      request
        .get('/')
        .expect(404, done);
    });

    it('Should use GraphQL middleware', function (done) {
      request
        .get('/graphql?query={users{id}}')
        .expect(200, done);
    });
  });

  describe('Database test', function () {
    it('Should post to users', function (done) {
      testPost()
        .then(() => {
          db.User.findById(1)
            .then((result) => {
              expect(result.id).to.equal(1);
              done();
            });
        });
    });
  });

  describe('GraphQL queries', function () {
    beforeEach((done) => {
      testPost()
        .then(() => done());
    });

    it('Should return JSON object', function (done) {
      request
        .post('/graphql?query={users{id}}')
        .expect('Content-type', /json/, done);
    });

    it('Should return an array of users', function (done) {
      request
        .post('/graphql?query={users{id}}')
        .then((results) => {
          expect(Array.isArray(results.body.data.users)).to.equal(true);
          done();
        });
    });

    it('Should return only specified parameters', function (done) {
      request
        .post('/graphql?query={users{id,age}}')
        .then((results) => {
          expect(results.body.data.users[0].id).to.equal(1);
          expect(results.body.data.users[0].age).to.equal(25);
          expect(results.body.data.users[0].location).to.not.exist;
          done();
        });
    });
  });
});

describe('Data Scripting', function () {
  this.timeout(5000);
  before(function (done) {
    db.User.drop()
      .then(() => db.Location.drop())
      .then(() => db.Location.sync({ force: true }))
      .then(() => db.User.sync({ force: true }))
      .then(() => createLocations())
      .then((results) => {
        cities = results;
      })
      .then(() => createUsers())
      .then((results) => {
        users = results;
      })
      .then(() => done());

    beforeEach(() => {
      server = app.listen(port);
    });

    afterEach(() => server.close());

    after(() => {
      db.User.drop()
        .then(() => db.Location.drop());
    });
  });
  it('Should post 20 cities', function (done) {
    expect(cities).to.have.lengthOf(20);
    done();
  });

  it('Should post cities with correct IDs', function (done) {
    const expectCities = [
      'New York City',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Philadelphia',
      'Phoenix',
      'San Antonio',
      'San Diego',
      'Dallas',
      'San Jose',
      'Austin',
      'Jacksonville',
      'San Francisco',
      'Indianapolis',
      'Columbus',
      'Fort Worth',
      'Charlotte',
      'Seattle',
      'Denver',
      'El Paso'
    ];

    cities.forEach(city =>
      expect(city.name).to.equal(expectCities[city.id - 1]));
    done();
  });

  it('Should create 1000 users', function (done) {
    expect(users).to.have.lengthOf(1000);
    done();
  });

  it('Should generate users with correct fields', function (done) {
    expect(users[0].id).to.exist;
    expect(users[0].age).to.exist;
    expect(users[0].locationId).to.exist;
    expect(users[0].createdAt).to.exist;
    expect(users[0].paidStatus).to.exist;
    expect(users[0].favoriteArtists).to.exist;
    expect(users[0].favoriteGenres).to.exist;
    expect(users[0].genreGroup).to.exist;
    done();
  });

  it('Should properly format user options', function (done) {
    users.forEach((user) => {
      expect(user.locationId).to.be.above(0);
      expect(user.locationId).to.be.below(21);
      expect(user.age).to.be.above(17);
      expect(user.age).to.be.below(91);
      expect(user.createdAt).to.be.above(new Date(2014, 0, 1));
      expect(user.createdAt).to.be.below(new Date(2017, 5, 1));
      expect(typeof user.paidStatus).to.equal('boolean');
      expect(Array.isArray(users[0].favoriteArtists)).to.equal(true);
      expect(Array.isArray(users[0].favoriteGenres)).to.equal(true);
      expect(user.genreGroup).to.equal(user.favoriteGenres[0]);
    });
    done();
  });
});
