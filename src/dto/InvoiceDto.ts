import { validateOrReject, IsEnum, IsDateString } from 'class-validator';
import { InvoiceStatus } from '../enum/InvoiceStatus';
import { Merchandise } from '../entity/Merchandise';

export class InvoiceDto {

    id: string;
    
    @IsDateString()
    dateOfInvoice: Date;

    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;

    supplierId: string;
    managerId: string;
    merchandises: Merchandise[];

    async validate() {
        await validateOrReject(this);
    }
}
