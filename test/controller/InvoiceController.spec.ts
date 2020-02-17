import {assert} from "chai";
import * as request from 'supertest';
import {Application} from '../../src/config/Application';
import {Logger} from '../../src/config/Logger';
import {LoggerLevel} from '../../src/enum/LoggerLevel';

const application: Application = new Application();

describe('Users controller integration test', () => {

  before(async () => {
    await application.start();
  });

  beforeEach(async () => {
    return await application.databaseConnection
      .synchronize(true)
      .catch(error =>
        Logger.log(`Test database error: ${error}`, LoggerLevel.ERROR)
      );
  });

  after(async () => {
    return application.close();
  });

  describe('GET /api/invoices', () => {
    it('respond with json containing an empty list of invoices', async () => {
      return request(application.appContext)
        .get('/api/invoices')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response: any) => {
          assert.deepEqual(response.body, []);
        })
    });
  });
});
