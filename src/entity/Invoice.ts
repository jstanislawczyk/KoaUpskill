import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, IsDefined, IsEnum, IsDateString, ValidateNested } from 'class-validator';
import { InvoiceStatus } from '../enum/InvoiceStatus';
import { Merchandise } from './Merchandise';
import { Type } from 'class-transformer';

@Entity()
export class Invoice {

    @ObjectIdColumn()
    id: ObjectID;
    
    @Column()
    @IsDateString()
    @IsDefined()
    dateOfInvoice: Date;

    @Column()
    @IsDefined()
    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;

    @Column()
    @IsDefined()
    supplierId: string;

    @Column()
    @IsDefined()
    managerId: string;

    @Column()
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => Merchandise)
    merchandises: Merchandise[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
