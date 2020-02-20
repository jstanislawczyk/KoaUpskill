import {validateOrReject, IsEnum, IsDateString, IsDefined} from 'class-validator';
import { InvoiceStatus } from '../enum/InvoiceStatus';
import { Merchandise } from '../entity/Merchandise';

export class InvoiceDto {

    id: string;
    
    @IsDateString()
    dateOfInvoice: string;

    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;

    @IsDefined()
    supplierId: string;

    @IsDefined()
    managerId: string;

    merchandises: Merchandise[];

    async validate() {
        await validateOrReject(this);
    }
}
