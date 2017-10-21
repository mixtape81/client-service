import supertest from 'supertest';
import app from '../server/app';

const request = supertest.agent(app);
const port = 7357;

beforeEach((done) => {
  const server = app.listen(port, done);
  afterEach(() => server.close());
});

describe('Client Server', () => {
  it('Should reject GET requests', (done) => {
    request
      .get('/')
      .expect(404, done);
  });
});
