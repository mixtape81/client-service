/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import db from '../database/database';

const request = supertest.agent(app);
const port = 7357;

let server;

const yyyymmdd = (date) => {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
};

const testPost = () => {
  const locations = [{
    name: 'San Francisco'
  }, {
    name: 'New York City'
  }];
  const users = [{
    joinDate: yyyymmdd(new Date()),
    age: 25,
    paidStatus: true,
    genreGroup: 3,
    favoriteArtists: [74, 46, 102, 8],
    favoriteGenres: [3, 4, 10, 2],
    locationId: 1
  }, {
    joinDate: yyyymmdd(new Date()),
    age: 34,
    paidStatus: false,
    genreGroup: 2,
    favoriteArtists: [500, 271, 10, 46],
    favoriteGenres: [2, 4, 9, 1],
    locationId: 2
  }];

  return db.Location.bulkCreate(locations)
    .then(() => db.User.bulkCreate(users))
    .catch(err => console.error(err));
};

describe('Basic Server Tests', function () {
  beforeEach(function (done) {
    server = app.listen(port);
    db.User.drop()
      .then(() => db.Location.drop())
      .then(() => db.Location.sync({ force: true }))
      .then(() => db.User.sync({ force: true }))
      .then(() => done());
  });

  afterEach(done => server.close(done));

  after((done) => {
    db.User.drop()
      .then(() => db.Location.drop())
      .then(() => db.Location.sync({ force: true }))
      .then(() => db.User.sync({ force: true }))
      .then(() => done());
  });

  describe('Client Server', function () {
    it('Should reject GET requests', function (done) {
      request
        .get('/')
        .expect(404, done);
    });

    it('Should use GraphQL middleware', function (done) {
      request
        .get('/graphql?query={users(id:[1]){id}}')
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
});
