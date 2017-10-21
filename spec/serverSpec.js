import { expect } from 'chai';
import request from 'request';

describe('Client Server', () => {
  it('Should answer GET requests', (done) => {
    request
      .get('http://localhost:3000', (err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
