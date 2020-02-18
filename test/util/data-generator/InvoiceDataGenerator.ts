import { Merchandise } from "../../../src/entity/Merchandise";
import { Invoice } from "../../../src/entity/Invoice";
import { InvoiceStatus } from "../../../src/enum/InvoiceStatus";
import { InvoiceDto } from "../../../src/dto/InvoiceDto";

export class InvoiceDataGenerator {
    public static createInvoice(supplierId: string, managerId: string, status: InvoiceStatus, date: Date, merchandises: Merchandise[]) {
        const invoice = new Invoice();

        invoice.supplierId = supplierId;
        invoice.managerId = managerId;
        invoice.status = status;
        invoice.dateOfInvoice = date;
        invoice.merchandises = merchandises;

        return invoice;
    }

    public static createInvoiceWithNoSupplier(managerId:string, status: InvoiceStatus, date: Date, merchandises: Merchandise[]) {
        const invoice = new Invoice();

        invoice.managerId = managerId;
        invoice.status = status;
        invoice.dateOfInvoice = date;
        invoice.merchandises = merchandises;

        return invoice;
    }

    public static createInvoiceDto(supplierId: string, managerId: string, status: InvoiceStatus, date: Date, merchandises: Merchandise[]) {
        const invoiceDto = new InvoiceDto();

        invoiceDto.supplierId = supplierId;
        invoiceDto.managerId = managerId;
        invoiceDto.status = status;
        invoiceDto.dateOfInvoice = date.toISOString();
        invoiceDto.merchandises = merchandises;

        return invoiceDto;
    }
}
