import { InvoiceService } from '../service/InvoiceService';
import {JsonController, Get, NotFoundError, Param, Authorized} from 'routing-controllers';
import { InvoiceDtoConverter } from '../dto-converter/InvoiceDtoConverter';
import { InvoiceDto } from '../dto/InvoiceDto';
import { SupplierService } from '../service/SupplierService';

@JsonController('/api/suppliers')
export class InvoiceController {

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly supplierService: SupplierService,
    ) {
    }

    @Get('/:supplierId/invoices')
    @Authorized()
    async getAllSupplierInvoices(@Param('supplierId') supplierId: string): Promise<InvoiceDto[]> {
        await this.supplierService.findOneSupplier(supplierId)
            .catch(() => {
                throw new NotFoundError(`Supplier with id=${supplierId} not found`);
            });

        return await this.invoiceService.getAllSupplierInvoices(supplierId)
            .then(invoices => 
                InvoiceDtoConverter.toListOfDtos(invoices)    
            );
    }
}
