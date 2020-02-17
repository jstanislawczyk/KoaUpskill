import { InvoiceService } from '../service/InvoiceService';
import { JsonController, Get, NotFoundError, Param } from 'routing-controllers';
import { InvoiceDtoConverter } from '../dto-converter/InvoiceDtoConverter';
import { InvoiceDto } from '../dto/InvoiceDto';
import { UserService } from '../service/UserService';

@JsonController('/users')
export class InvoiceController {

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly userService: UserService,
    ) {
    }

    @Get('/:managerId/invoices')
    async getAllSupplierInvoices(@Param('managerId') managerId: string): Promise<InvoiceDto[]> {
        await this.userService.findOneUser(managerId)
            .catch(() => {
                throw new NotFoundError(`User with id=${managerId} not found`);
            });

        return await this.invoiceService.getAllManagerInvoices(managerId)
            .then(invoices => 
                InvoiceDtoConverter.toListOfDtos(invoices)    
            );
    }
}
