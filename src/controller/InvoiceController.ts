import { InvoiceService } from '../service/InvoiceService';
import {JsonController, Post, Body, Get, NotFoundError, Param, HttpCode} from 'routing-controllers';
import { Invoice } from '../entity/Invoice';
import { InvoiceDtoConverter } from '../dto-converter/InvoiceDtoConverter';
import { InvoiceDto } from '../dto/InvoiceDto';

@JsonController('/invoices')
export class InvoiceController {

    constructor(private readonly invoiceService: InvoiceService) {
    }

    @Get()
    async getAllInvoices(): Promise<InvoiceDto[]> {
        return await this.invoiceService.getAllInvoices()
            .then(invoices => 
                InvoiceDtoConverter.toListOfDtos(invoices)    
            );
    }

    @Get('/:id')
    async getInvoiceById(@Param('id') id: string): Promise<InvoiceDto> {
        return await this.invoiceService.getInvoiceById(id)
            .then(invoice => 
                InvoiceDtoConverter.toDto(invoice)    
            ) 
            .catch(() => {
                throw new NotFoundError(`Invoice with id=${id} not found`);
            });
    }

    @Post()
    @HttpCode(201)
    async saveInvoice(@Body({ validate: true }) invoiceDto: InvoiceDto): Promise<InvoiceDto> {
        const invoice: Invoice = InvoiceDtoConverter.toEntity(invoiceDto);

        return await this.invoiceService.saveInvoice(invoice)
          .then((savedInvoice: Invoice) =>
            InvoiceDtoConverter.toDto(savedInvoice)
          );
    }
}
