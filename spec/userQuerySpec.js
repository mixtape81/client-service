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
const port = 5050;
const filePath = '/psqltmp/users.csv';
let server;

describe('GraphQL queries', function () {
  this.timeout(6000);
  before(function (done) {
    db.User.drop()
      .then(() => db.Location.drop())
      .then(() => db.Location.sync({ force: true }))
      .then(() => db.User.sync({ force: true }))
      .then(() => createLocations())
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

  it('Should return JSON object', function (done) {
    request
      .post('/graphql?query={users(id:[1]){id}}')
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
        expect(results.body.data.users[0].id).to.exist;
        expect(results.body.data.users[0].age).to.exist;
        expect(results.body.data.users[0].favoriteArtists).to.not.exist;
        done();
      });
  });

  it('Should query favoriteGenres array field', function (done) {
    request
      .post('/graphql?query={users(favoriteGenres:[4]){favoriteGenres}}')
      .then((results) => {
        expect(results.body.data.users.map(user =>
          user.favoriteGenres).reduce((bool, favoriteGenres) =>
          favoriteGenres.includes(4), false)).to.be.true;
        done();
      });
  });
  it('Should query favoriteArtists array field', function (done) {
    request
      .post('/graphql?query={users(id:[1]){favoriteArtists}}')
      .then((userOne) => {
        const artistId = userOne.body.data.users[0].favoriteArtists[0];
        request
          .post(`/graphql?query={users(favoriteArtists:[${artistId}])
          {favoriteArtists}}`)
          .then((results) => {
            expect(results.body.data.users.map(user =>
              user.favoriteArtists).reduce((bool, favoriteArtists) =>
              favoriteArtists.includes(artistId), false)).to.be.true;
            done();
          });
      });
  });


  it('Should query a range of IDs (inclusive)', function (done) {
    request
      .post('/graphql?query={users(id:[21,30]){id}}')
      .then((results) => {
        expect(results.body.data.users).to.have.lengthOf(10);
        done();
      });
  });

  it('Should only query IDs within a range', function (done) {
    request
      .post('/graphql?query={users(id:[501,560]){id}}')
      .then((results) => {
        expect(results.body.data.users).to.have.lengthOf(60);
        expect(results.body.data.users.map(user =>
          user.id).reduce((bool, id) =>
          id >= 501 && id <= 560, false)).to.be.true;
        done();
      });
  });

  it('Should only query ages within a range', function (done) {
    request
      .post('/graphql?query={users(age:[18,34]){age}}')
      .then((results) => {
        expect(results.body.data.users.map(user =>
          user.age).reduce((bool, age) =>
          age >= 18 && age <= 34, false)).to.be.true;
        done();
      });
  });

  it('Should resolve the location name', function (done) {
    request
      .post('/graphql?query={users(id:[1]){location{name}}}')
      .then((results) => {
        expect(typeof results.body.data.users[0].location.name ===
          'string').to.be.true;
        done();
      });
  });
});
