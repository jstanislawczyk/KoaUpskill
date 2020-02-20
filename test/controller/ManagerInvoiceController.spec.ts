import {assert} from 'chai';
import * as request from 'supertest';
import {getRepository} from 'typeorm';
import {Application} from '../../src/config/Application';
import {Logger} from '../../src/config/Logger';
import {InvoiceDtoConverter} from '../../src/dto-converter/InvoiceDtoConverter';
import {InvoiceDto} from '../../src/dto/InvoiceDto';
import {Invoice} from '../../src/entity/Invoice';
import {Merchandise} from '../../src/entity/Merchandise';
import {User} from '../../src/entity/User';
import {InvoiceStatus} from '../../src/enum/InvoiceStatus';
import {LoggerLevel} from '../../src/enum/LoggerLevel';
import {UserRole} from '../../src/enum/UserRole';
import {Error} from '../../src/exception/Error';
import {ErrorDataGenerator} from '../util/data-generator/ErrorDataGenerator';
import {InvoiceDataGenerator} from '../util/data-generator/InvoiceDataGenerator';
import {MerchandiseDataGenerator} from '../util/data-generator/MerchandiseDataGenerator';
import {UserDataGenerator} from '../util/data-generator/UserDataGenerator';

const application: Application = new Application();

describe('Manager invoice controller integration test', () => {

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
    await application.close();
  });

  describe('GET /users/{managerId}/invoices NotFound', () => {
    it('respond with manager not found error', async () => {
      return await request(application.appContext)
        .get('/api/users/NotExistingManagerId/invoices')
        .set('Accept', 'application/json')
        .expect(404)
        .then((response: any) => {
          const errorResponse: Error = JSON.parse(response.text);
          const expectedErrorResponse = ErrorDataGenerator.createError(404, 'User with id=NotExistingManagerId not found');

          assert.deepEqual(errorResponse, expectedErrorResponse);
        });
    });
  });

  describe('GET /users/{managerId}/invoices empty', () => {
    it('respond with empty invoices list', async () => {
      let user: User = UserDataGenerator.createUser('John', 'Doe', UserRole.MANAGER);
      user = await getRepository(User).save(user);

      return await request(application.appContext)
        .get(`/api/users/${user.id}/invoices`)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response: any) => {
          assert.deepEqual(response.body, []);
        });
    });
  });

  describe('GET /users/{managerId}/invoices', () => {
    it('respond with invoices list', async () => {
      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      let user: User = UserDataGenerator.createUser('John', 'Doe', UserRole.MANAGER);
      user = await getRepository(User).save(user);

      const invoices: Invoice[] = [
        InvoiceDataGenerator.createInvoice('SupplierId1', user.id.toHexString(), InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises),
        InvoiceDataGenerator.createInvoice('SupplierId2', user.id.toHexString(), InvoiceStatus.REJECTED, new Date(2018, 11, 13), merchandises),
      ];

      const savedInvoices: Invoice[] = await getRepository(Invoice).save(invoices);
      const savedInvoicesDto: InvoiceDto[] = InvoiceDtoConverter.toListOfDtos(savedInvoices);

      return await request(application.appContext)
        .get(`/api/users/${user.id}/invoices`)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response: any) => {
          assert.deepEqual(response.body, savedInvoicesDto);
        });
    });
  });
});
