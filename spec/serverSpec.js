/* eslint no-unused-expressions: 0 */
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../server/app';
import db from '../database/database';
import addLocations from '../data/locations';

const request = supertest.agent(app);
const port = 7357;

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

beforeEach((done) => {
  const server = app.listen(port);
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

describe('Client Server', () => {
  it('Should reject GET requests', (done) => {
    request
      .get('/')
      .expect(404, done);
  });

  it('Should use GraphQL middleware', (done) => {
    request
      .get('/graphql?query={users{id}}')
      .expect(200, done);
  });
});

describe('Database test', () => {
  it('Should post to users', (done) => {
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

describe('GraphQL queries', () => {
  beforeEach((done) => {
    testPost()
      .then(() => done());
  });

  it('Should return JSON object', (done) => {
    request
      .post('/graphql?query={users{id}}')
      .expect('Content-type', /json/, done);
  });

  it('Should return an array of users', (done) => {
    request
      .post('/graphql?query={users{id}}')
      .then((results) => {
        expect(Array.isArray(results.body.data.users)).to.equal(true);
        done();
      });
  });

  it('Should return only specified parameters', (done) => {
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

describe('Data Scripting', () => {
  it('Should post 20 cities', (done) => {
    addLocations()
      .then((results) => {
        expect(results).to.have.lengthOf(20);
        done();
      });
  });

  it('Should post cities with correct IDs', (done) => {
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
    addLocations()
      .then(cities => cities.forEach(city =>
        expect(city.name).to.equal(expectCities[city.id - 1])))
      .then(() => done());
  });
});
