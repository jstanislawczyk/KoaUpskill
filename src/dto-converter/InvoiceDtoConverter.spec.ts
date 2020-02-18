import { expect } from 'chai';
import { InvoiceDto } from '../dto/InvoiceDto';
import { InvoiceStatus } from '../enum/InvoiceStatus';
import { Merchandise } from '../entity/Merchandise';
import { Invoice } from '../entity/Invoice';
import { InvoiceDtoConverter } from './InvoiceDtoConverter';

describe('InvoiceDtoConverter unit tests', () => {

    describe('toDto()', () => {
        it('should return correct dto from invoice', () => {
            const merchandises = [createTestMerchandise('TEST1', 11.11, 4), createTestMerchandise('TEST2', 2.33, 11)];
            const invoiceToConvert: Invoice = createTestInvoice(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId', 'SomeManagerId', merchandises);
            const expectedInvoiceDto: InvoiceDto = createTestInvoiceDto(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId', 'SomeManagerId', merchandises);
           
            expect(InvoiceDtoConverter.toDto(invoiceToConvert))
                .to.eql(expectedInvoiceDto);
        });
    });

    describe('toEntity()', () => {
        it('should return correct invoice from dto', () => {
            const merchandises = [createTestMerchandise('TEST1', 11.11, 4), createTestMerchandise('TEST2', 2.33, 11)];
            const invoiceDtoToConvert: InvoiceDto = createTestInvoiceDto(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId', 'SomeManagerId', merchandises);
            const expectedInvoice: Invoice = createTestInvoice(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId', 'SomeManagerId', merchandises);
           
            expect(InvoiceDtoConverter.toEntity(invoiceDtoToConvert))
                .to.eql(expectedInvoice);
        });
    });

    describe('toListOfDtos()', () => {
        it('should return correct list of invoice dtos from invoices list', () => {
            const firstMerchandises = [createTestMerchandise('TEST1', 11.11, 4), createTestMerchandise('TEST2', 2.33, 11)];
            const secondMerchandises = [createTestMerchandise('TEST3', 22.11, 14), createTestMerchandise('TEST4', 32.33, 12)];

            const invoicesToConvert: Invoice[]  = [
                createTestInvoice(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId1', 'SomeManagerId1', firstMerchandises),
                createTestInvoice(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId2', 'SomeManagerId2', secondMerchandises),
            ];
            const expectedInvoiceDtos: InvoiceDto[] = [
                createTestInvoiceDto(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId1', 'SomeManagerId1', firstMerchandises),
                createTestInvoiceDto(new Date(2019, 11, 17), InvoiceStatus.ACCEPTED, 'SomeSupplierId2', 'SomeManagerId2', secondMerchandises),
            ];
           
            expect(InvoiceDtoConverter.toListOfDtos(invoicesToConvert))
                .to.eql(expectedInvoiceDtos);
        });
    });
});

const createTestMerchandise = (name: string, price: number, quantity: number): Merchandise => {
    const merchandise = new Merchandise();

    merchandise.name = name;
    merchandise.price = price;
    merchandise.quantity = quantity;

    return merchandise;
};

const createTestInvoice = 
    (dateOfInvoice: Date, status: InvoiceStatus, supplierId: string, managerId: string, merchandises: Merchandise[]): Invoice => {

    const invoice = new Invoice();

    invoice.dateOfInvoice = dateOfInvoice;
    invoice.status = status;
    invoice.supplierId = supplierId;
    invoice.managerId = managerId;
    invoice.merchandises = merchandises;

    return invoice;
};

const createTestInvoiceDto =
    (dateOfInvoice: Date, status: InvoiceStatus, supplierId: string, managerId: string, merchandises: Merchandise[]): InvoiceDto => {

    const invoiceDto = new InvoiceDto();
    
    invoiceDto.id = '';
    invoiceDto.dateOfInvoice = dateOfInvoice.toISOString();
    invoiceDto.status = status;
    invoiceDto.supplierId = supplierId;
    invoiceDto.managerId = managerId;
    invoiceDto.merchandises = merchandises;

    return invoiceDto;
};
