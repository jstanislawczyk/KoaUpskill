import {assert} from 'chai';
import * as request from 'supertest';
import {getRepository} from 'typeorm';
import {Application} from '../../src/config/Application';
import {Logger} from '../../src/config/Logger';
import {InvoiceDtoConverter} from '../../src/dto-converter/InvoiceDtoConverter';
import {InvoiceDto} from '../../src/dto/InvoiceDto';
import {Invoice} from '../../src/entity/Invoice';
import {Merchandise} from '../../src/entity/Merchandise';
import {Supplier} from '../../src/entity/Supplier';
import {User} from '../../src/entity/User';
import {InvoiceStatus} from '../../src/enum/InvoiceStatus';
import {LoggerLevel} from '../../src/enum/LoggerLevel';
import {UserRole} from '../../src/enum/UserRole';
import {Error} from '../../src/exception/Error';
import {ErrorDataGenerator} from '../util/data-generator/ErrorDataGenerator';
import {InvoiceDataGenerator} from '../util/data-generator/InvoiceDataGenerator';
import {MerchandiseDataGenerator} from '../util/data-generator/MerchandiseGenerator';
import {SupplierDataGenerator} from '../util/data-generator/SupplierDataGenerator';
import {UserDataGenerator} from '../util/data-generator/UserDataGenerator';

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

  describe('GET /api/invoices empty', () => {
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

  describe('GET /api/invoices', () => {
    it('respond with json containing an empty list of invoices', async () => {
      const firstMerchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      const secondMerchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST3', 113.33, 15),
        MerchandiseDataGenerator.createMerchandise('TEST4', 4.33, 11),
      ];

      const invoices: Invoice[] = [
        InvoiceDataGenerator.createInvoice('SupplierId1', 'ManagerId1', InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), firstMerchandises),
        InvoiceDataGenerator.createInvoice('SupplierId2', 'ManagerId2', InvoiceStatus.REJECTED, new Date(2017, 7, 13), secondMerchandises),
      ];

      const invoicesDto: InvoiceDto[] = InvoiceDtoConverter.toListOfDtos(invoices);

      await getRepository(Invoice).save(invoices);

      return request(application.appContext)
        .get('/api/invoices')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response: any) => {
          assert.isNotNull(response.body[0].managerId);
          assert.equal(response.body[0].managerId, invoicesDto[0].managerId);
          assert.equal(response.body[0].supplierId, invoicesDto[0].supplierId);
          assert.equal(response.body[0].status, invoicesDto[0].status);
          assert.equal(response.body[0].dateOfInvoice, invoicesDto[0].dateOfInvoice);
          assert.deepEqual(response.body[0].merchandises, invoicesDto[0].merchandises);

          assert.isNotNull(response.body[1].managerId);
          assert.equal(response.body[1].managerId, invoicesDto[1].managerId);
          assert.equal(response.body[1].supplierId, invoicesDto[1].supplierId);
          assert.equal(response.body[1].status, invoicesDto[1].status);
          assert.equal(response.body[1].dateOfInvoice, invoicesDto[1].dateOfInvoice);
          assert.deepEqual(response.body[1].merchandises, invoicesDto[1].merchandises);
        })
    });
  });

  describe('GET /api/invoices/{id} NotFound', () => {
    it('respond with invoice not found error', async () => {
      return request(application.appContext)
        .get(`/api/invoices/5e445b53a1bc7a2354236a3a`)
        .set('Accept', 'application/json')
        .expect(404)
        .then((response: any) => {
          const errorResponse: Error = JSON.parse(response.text);
          const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Invoice with id=5e445b53a1bc7a2354236a3a not found');

          assert.deepEqual(errorResponse, expectedErrorResponse);
        })
    });
  });

  describe('GET /api/invoices/{id}', () => {
    it('respond with invoice json', async () => {
      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      const invoice: Invoice = InvoiceDataGenerator.createInvoice(
        'SupplierId1', 'ManagerId1', InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises);

      const invoiceDto: InvoiceDto = InvoiceDtoConverter.toDto(invoice);
      const savedInvoice: Invoice = await getRepository(Invoice).save(invoice);

      return request(application.appContext)
        .get(`/api/invoices/${savedInvoice.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response: any) => {
          assert.isNotNull(response.body.managerId);
          assert.equal(response.body.managerId, invoiceDto.managerId);
          assert.equal(response.body.supplierId, invoiceDto.supplierId);
          assert.equal(response.body.status, invoiceDto.status);
          assert.equal(response.body.dateOfInvoice, invoiceDto.dateOfInvoice);
          assert.deepEqual(response.body.merchandises, invoiceDto.merchandises);
        })
    });
  });

  describe('POST /api/invoices BadRequest', () => {
    it('respond with validation error', async () => {
      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      const invoice: Invoice = InvoiceDataGenerator.createInvoiceWithNoSupplier(
        'ManagerId1', InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises);

      return request(application.appContext)
        .post('/api/invoices')
        .send(invoice)
        .set('Accept', 'application/json')
        .expect(400);
    });
  });

  describe('POST /api/invoices', () => {
    it('respond with JSON containing saved invoice', async () => {
      let user: User = UserDataGenerator.createUser('John', 'Doe', UserRole.MANAGER);
      user = await getRepository(User).save(user);

      let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
      supplier = await getRepository(Supplier).save(supplier);

      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      const invoiceDto: InvoiceDto = InvoiceDataGenerator.createInvoiceDto(
        supplier.id.toHexString(), user.id.toHexString(), InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises);

      return request(application.appContext)
        .post('/api/invoices')
        .send(invoiceDto)
        .set('Accept', 'application/json')
        .expect(201)
        .then((response: any) => {
          assert.isNotNull(response.body.id);
          assert.equal(response.body.supplierId, invoiceDto.supplierId);
          assert.equal(response.body.managerId, invoiceDto.managerId);
          assert.equal(response.body.dateOfInvoice, invoiceDto.dateOfInvoice);
          assert.equal(response.body.status, invoiceDto.status);
          assert.deepEqual(response.body.merchandises, invoiceDto.merchandises);
        });
    });
  });

  describe('POST /api/invoices NotFound Manager', () => {
    it('respond with validation error', async () => {
      let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
      supplier = await getRepository(Supplier).save(supplier);

      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      const invoice: Invoice = InvoiceDataGenerator.createInvoice(
        supplier.id.toHexString(), 'ManagerId1', InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises);

      return request(application.appContext)
        .post('/api/invoices')
        .send(invoice)
        .set('Accept', 'application/json')
        .expect(404)
        .then((response: any) => {
          const errorResponse: Error = JSON.parse(response.text);
          const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Manager with id=ManagerId1 not found');

          assert.deepEqual(errorResponse, expectedErrorResponse);
        });
    });
  });

  describe('POST /api/invoices NotFound Supplier', () => {
    it('respond with validation error', async () => {
      let user: User = UserDataGenerator.createUser('John', 'Doe', UserRole.MANAGER);
      user = await getRepository(User).save(user);

      const merchandises: Merchandise[] = [
        MerchandiseDataGenerator.createMerchandise('TEST1', 13.33, 12),
        MerchandiseDataGenerator.createMerchandise('TEST2', 33.33, 5),
      ];

      const invoice: Invoice = InvoiceDataGenerator.createInvoice(
        'SupplierId', user.id.toHexString(), InvoiceStatus.ACCEPTED, new Date(2016, 1, 3), merchandises);

      return request(application.appContext)
        .post('/api/invoices')
        .send(invoice)
        .set('Accept', 'application/json')
        .expect(404)
        .then((response: any) => {
          const errorResponse: Error = JSON.parse(response.text);
          const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Supplier with id=SupplierId not found');

          assert.deepEqual(errorResponse, expectedErrorResponse);
        });
    });
  });
});
