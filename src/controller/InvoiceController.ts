import { InvoiceService } from '../service/InvoiceService';
import {JsonController, Post, Body, Get, NotFoundError, Param, HttpCode, Authorized} from 'routing-controllers';
import { Invoice } from '../entity/Invoice';
import { InvoiceDtoConverter } from '../dto-converter/InvoiceDtoConverter';
import { InvoiceDto } from '../dto/InvoiceDto';
import { SupplierService } from '../service/SupplierService';
import { UserService } from '../service/UserService';

@JsonController('/invoices')
export class InvoiceController {

    constructor(
      private readonly invoiceService: InvoiceService,
      private readonly supplierService: SupplierService,
      private readonly userService: UserService,
    ) {
    }

    @Get()
    @Authorized()
    async getAllInvoices(): Promise<InvoiceDto[]> {
        return await this.invoiceService.getAllInvoices()
            .then(invoices => 
                InvoiceDtoConverter.toListOfDtos(invoices)    
            );
    }

    @Get('/:id')
    @Authorized()
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
    @Authorized()
    @HttpCode(201)
    async saveInvoice(@Body({ validate: true }) invoiceDto: InvoiceDto): Promise<InvoiceDto> {
        const invoice: Invoice = InvoiceDtoConverter.toEntity(invoiceDto);

        await this.userService
          .findOneUser(invoiceDto.managerId)
          .catch(() => {
              throw new NotFoundError(`Manager with id=${invoiceDto.managerId} not found`);
          });

        await this.supplierService
          .findOneSupplier(invoiceDto.supplierId)
          .catch(() => {
              throw new NotFoundError(`Supplier with id=${invoiceDto.supplierId} not found`);
          });

        return await this.invoiceService.saveInvoice(invoice)
          .then((savedInvoice: Invoice) =>
            InvoiceDtoConverter.toDto(savedInvoice)
          );
    }
}
