const request = require('supertest');
import { Application } from '../../src/config/Application';

const application: Application = new Application();
const applicationStartContext = application.start()

describe('GET /api/users', () => {
    it('respond with json containing a list of all users', async (done) => {
        await applicationStartContext;

        request(application.app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

