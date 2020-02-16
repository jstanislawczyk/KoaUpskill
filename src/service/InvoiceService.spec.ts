import * as sinon from 'sinon';
import * as assert from 'assert';
import { InvoiceRepository } from '../repository/InvoiceRepository';
import { InvoiceService } from './InvoiceService';
import { Invoice } from '../entity/Invoice';
import { Merchandise } from '../entity/Merchandise';
import { InvoiceStatus } from '../enum/InvoiceStatus';

describe('Invoice service', () => {
    describe('getAllInvoices()', () => {
        it('Should return all invoices', async () => {
            const invoiceRepository: InvoiceRepository = new InvoiceRepository();
            const invoiceService: InvoiceService = new InvoiceService(invoiceRepository);

            sinon.stub(invoiceRepository, 'find' as any).resolves([getInvoice(), getInvoice()]);

            assert.deepEqual(await invoiceService.getAllInvoices(), [getInvoice(), getInvoice()]);
        });
    });

    describe('getAllInvoices() empty', () => {
        it('Should get empty invoices list', async () => {
            const invoiceRepository: InvoiceRepository = new InvoiceRepository();
            const invoiceService: InvoiceService = new InvoiceService(invoiceRepository);

            sinon.stub(invoiceRepository, 'find' as any).resolves([]);

            assert.deepEqual(await invoiceService.getAllInvoices(), []);
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

