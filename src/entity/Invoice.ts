import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, IsDefined, IsEnum, IsDate } from 'class-validator';
import { InvoiceStatus } from '../enum/InvoiceStatus';
import { Merchandise } from './Merchandise';

@Entity()
export class Invoice {

    @ObjectIdColumn()
    id: ObjectID;
    
    @Column()
    @IsDate()
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
    merchandises: Merchandise[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
