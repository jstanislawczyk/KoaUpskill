import * as sinon from 'sinon';
import * as assert from 'assert';
import { InvoiceRepository } from '../repository/InvoiceRepository';
import { InvoiceService } from './InvoiceService';
import { Invoice } from '../entity/Invoice';
import { Merchandise } from '../entity/Merchandise';
import { InvoiceStatus } from '../enum/InvoiceStatus';
import { expect } from 'chai';

describe('Invoice service', () => {

    let invoiceRepository: InvoiceRepository;
    let invoiceService: InvoiceService

    beforeEach(() => {
        invoiceRepository = new InvoiceRepository();
        invoiceService = new InvoiceService(invoiceRepository);
    });

    describe('getAllInvoices()', () => {
        it('Should return all invoices', async () => {
            sinon.stub(invoiceRepository, 'find' as any).resolves([getInvoice(), getInvoice()]);

            assert.deepEqual(await invoiceService.getAllInvoices(), [getInvoice(), getInvoice()]);
        });
    });

    describe('getAllInvoices() empty', () => {
        it('Should get empty invoices list', async () => {
            sinon.stub(invoiceRepository, 'find' as any).resolves([]);

            assert.deepEqual(await invoiceService.getAllInvoices(), []);
        });
    });

    describe('getInvoiceById()', () => {
        it('Should find one invoice', async () => {
            sinon.stub(invoiceRepository, 'findOne' as any).resolves(getInvoice());

            assert.deepEqual(await invoiceService.getInvoiceById('Som3ID'), getInvoice());
        });
    });

    describe('getInvoiceById() should fail', () => {
        it('Should find one invoice', async () => {
            sinon.stub(invoiceRepository, 'findOne' as any).rejects(new Error());

            try { 
                await invoiceService.getInvoiceById('Som3ID');
                expect.fail();
            } catch (error) {

            }    
        });
    });

    describe('getAllSupplierInvoices()', () => {
        it('Should return all invoices for supplier', async () => {
            sinon.stub(invoiceRepository, 'findAllBySupplier' as any).resolves([getInvoice(), getInvoice()]);

            assert.deepEqual(await invoiceService.getAllSupplierInvoices('Som3Id'), [getInvoice(), getInvoice()]);
        });
    });
    
    describe('getAllManagerInvoices()', () => {
        it('Should return all invoices for manager', async () => {
            sinon.stub(invoiceRepository, 'findAllByManager' as any).resolves([getInvoice(), getInvoice()]);

            assert.deepEqual(await invoiceService.getAllManagerInvoices('Som3Id'), [getInvoice(), getInvoice()]);
        });
    });
});

const getInvoice = (): Invoice => {
    const invoice = new Invoice();

    invoice.dateOfInvoice = new Date(2019, 11, 12);
    invoice.status = InvoiceStatus.ACCEPTED;
    invoice.managerId = 'SomeManagerId';
    invoice.supplierId = 'SomeSupplierId';
    invoice.merchandises = [getMerchandise(), getMerchandise()];

    return invoice;
}

const getMerchandise = (): Merchandise => {
    const merchandise = new Merchandise();

    merchandise.name = 'SomeMerchandise';
    merchandise.quantity = 33;
    merchandise.price = 11.36;

    return merchandise;
}

