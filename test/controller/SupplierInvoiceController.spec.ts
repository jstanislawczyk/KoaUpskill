import {assert} from 'chai';
import {getRepository} from 'typeorm';
import {Application} from '../../src/config/Application';
import {Logger} from '../../src/config/Logger';
import {InvoiceDtoConverter} from '../../src/dto-converter/InvoiceDtoConverter';
import {InvoiceDto} from '../../src/dto/InvoiceDto';
import {Invoice} from '../../src/entity/Invoice';
import {Merchandise} from '../../src/entity/Merchandise';
import {Supplier} from '../../src/entity/Supplier';
import {InvoiceStatus} from '../../src/enum/InvoiceStatus';
import {LoggerLevel} from '../../src/enum/LoggerLevel';
import {Error} from '../../src/exception/Error';
import {ErrorDataGenerator} from '../util/data-generator/ErrorDataGenerator';
import {InvoiceDataGenerator} from '../util/data-generator/InvoiceDataGenerator';
import {MerchandiseDataGenerator} from '../util/data-generator/MerchandiseDataGenerator';
import {SupplierDataGenerator} from '../util/data-generator/SupplierDataGenerator';
import * as request from 'supertest';
import {SecurityConfig} from "../util/security/SecurityConfig";

const application: Application = new Application();

describe('Supplier invoice controller integration test', () => {

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

  describe('GET /suppliers/{supplierId}/invoices UNAUTHORIZED', () => {
    it('respond with empty invoices list', async () => {
      let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
      supplier = await getRepository(Supplier).save(supplier);

      return request(application.appContext)
          .get(`/api/suppliers/${supplier.id}/invoices`)
          .set('Accept', 'application/json')
          .expect(401);
    });
  });

  describe('GET /suppliers/{supplierId}/invoices NOT FOUND', () => {
    it('respond with supplier not found error', async () => {
      const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();

      return await request(application.appContext)
        .get('/api/suppliers/NotExistingManagerId/invoices')
        .set({
          'Authorization': `Bearer ${fakeToken}`,
          'Accept': 'application/json',
        })
        .expect(404)
        .then((response: any) => {
          const errorResponse: Error = JSON.parse(response.text);
          const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Supplier with id=NotExistingManagerId not found');

          assert.deepEqual(errorResponse, expectedErrorResponse);
        });
    });
  });

  describe('GET /suppliers/{supplierId}/invoices EMPTY', () => {
    it('respond with empty invoices list', async () => {
      const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();
      let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
      supplier = await getRepository(Supplier).save(supplier);

      return await request(application.appContext)
          .get(`/api/suppliers/${supplier.id}/invoices`)
          .set({
            'Authorization': `Bearer ${fakeToken}`,
            'Accept': 'application/json',
          })
          .expect(200)
          .then((response: any) => {
            assert.deepEqual(response.body, []);
          });
    });
  });

  describe('GET /suppliers/{supplierId}/invoices', () => {
    it('respond with invoices list', async () => {
      const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();
      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
      supplier = await getRepository(Supplier).save(supplier);

      const invoices: Invoice[] = [
        InvoiceDataGenerator.createInvoice(supplier.id.toHexString(), 'SupplierId1', InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises),
        InvoiceDataGenerator.createInvoice(supplier.id.toHexString(), 'SupplierId1', InvoiceStatus.REJECTED, new Date(2018, 11, 13), merchandises),
      ];

      const savedInvoices: Invoice[] = await getRepository(Invoice).save(invoices);
      const savedInvoicesDto: InvoiceDto[] = InvoiceDtoConverter.toListOfDtos(savedInvoices);

      return await request(application.appContext)
        .get(`/api/suppliers/${supplier.id}/invoices`)
        .set({
          'Authorization': `Bearer ${fakeToken}`,
          'Accept': 'application/json',
        })
        .expect(200)
        .then((response: any) => {
          assert.deepEqual(response.body, savedInvoicesDto);
        });
    });
  });
});
