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
const filePath = '/psqltmp/users.csv';

let server;
let cities;
let users;

const yyyymmdd = (date) => {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
};

const testPost = () => {
  const location = {
    name: 'San Francisco'
  };
  const user = {
    joinDate: yyyymmdd(new Date()),
    age: 25,
    paidStatus: true,
    genreGroup: 3,
    favoriteArtists: [74, 46, 102, 8],
    favoriteGenres: [1, 4, 10, 2],
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
        .post('/graphql?query={users(id:[1]){id}}')
        .then((results) => {
          expect(Array.isArray(results.body.data.users)).to.equal(true);
          done();
        });
    });

    it('Should return only specified parameters', function (done) {
      request
        .post('/graphql?query={users(id:[1]){id,age}}')
        .then((results) => {
          expect(results.body.data.users[0].id).to.equal(1);
          expect(results.body.data.users[0].age).to.equal(25);
          expect(results.body.data.users[0].location).to.not.exist;
          done();
        });
    });

    it('Should query array fields', function (done) {
      request
        .post('/graphql?query={users(favoriteGenres:[4],favoriteArtists:[8]){id,favoriteGenres,favoriteArtists}}')
        .then((results) => {
          expect(results.body.data.users[0].id).to.equal(1);
          expect(results.body.data.users[0].favoriteGenres).to.have.lengthOf(4);
          expect(results.body.data.users[0].favoriteArtists)
            .to.have.lengthOf(4);
          done();
        });
    });
  });
});

describe('Data Scripting', function () {
  this.timeout(60000);
  before(function (done) {
    db.User.drop()
      .then(() => db.Location.drop())
      .then(() => db.Location.sync({ force: true }))
      .then(() => db.User.sync({ force: true }))
      .then(() => createLocations())
      .then((results) => {
        cities = results;
      })
      .then(() => createUsers(0, filePath, () => {
        db.db.query(`COPY users FROM '${filePath}' DELIMITER ';'`)
          .then(() => done());
      }));

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
    db.User.findAll()
      .then((results) => {
        users = results;
        expect(users).to.have.lengthOf(1000);
        done();
      });
  });

  it('Should generate users with correct fields', function (done) {
    expect(users[0].id).to.exist;
    expect(users[0].age).to.exist;
    expect(users[0].locationId).to.exist;
    expect(users[0].joinDate).to.exist;
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
      expect(typeof user.paidStatus).to.equal('boolean');
      expect(user.joinDate).to.have.lengthOf(8);
      expect(Array.isArray(user.favoriteArtists)).to.equal(true);
      expect(Array.isArray(user.favoriteGenres)).to.equal(true);
      expect(user.genreGroup).to.equal(user.favoriteGenres[0]);
    });
    done();
  });
});
