import { Invoice } from "../entity/Invoice";
import { InvoiceDto } from "../dto/InvoiceDto";

export class InvoiceDtoConverter {

    public static toDto(invoice: Invoice): InvoiceDto {
        const invoiceDto = new InvoiceDto();

        invoiceDto.id = invoice.id 
            ? invoice.id.toHexString() 
            : '';
        invoiceDto.dateOfInvoice = invoice.dateOfInvoice;
        invoiceDto.status = invoice.status;
        invoiceDto.supplierId = invoice.supplierId;
        invoiceDto.managerId = invoice.managerId;
        invoiceDto.merchandises = invoice.merchandises;

        return invoiceDto;
    }

    public static toEntity(invoiceDto: InvoiceDto): Invoice {
        const invoice = new Invoice();

        invoice.dateOfInvoice = invoiceDto.dateOfInvoice;
        invoice.status = invoiceDto.status;
        invoice.supplierId = invoiceDto.supplierId;
        invoice.managerId = invoiceDto.managerId;
        invoice.merchandises = invoiceDto.merchandises;

        return invoice;
    }

    public static toListOfDtos(invoices: Invoice[]): InvoiceDto[] {
        return invoices.map(invoice => 
            this.toDto(invoice)
        );
    }
}
