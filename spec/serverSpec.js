process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const app = require('../server/app');
const db = require('../database/database');

const request = supertest.agent(app);
const port = 7357;
const tables = ['User'];

beforeEach((done) => {
  const server = app.listen(port);
  db.User.drop()
    .then(() => db.User.sync({}))
    .then(() => done());
  afterEach(() => {
    server.close();
    db.User.drop();
  });
});

describe('Client Server', () => {
  it('Should reject GET requests', (done) => {
    request
      .get('/')
      .expect(404, done);
  });
});

describe('Database queries', () => {
  it('Should post to users', (done) => {
    request
      .post('/users')
      .expect(200, done);
  });
});
