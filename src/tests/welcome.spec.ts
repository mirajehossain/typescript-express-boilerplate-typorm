import 'mocha';

import chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from './tests-helper';

chai.use(chaiHttp);

describe('API Ready', () => {

  it('should ensure that API is up & running', (done) => {
	chai.request(app)
		.get('/api')
		.end((err, res) => {
		res.should.have.status(200);
		done();
		});
  });
});
