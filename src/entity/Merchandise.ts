import { BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, IsDefined, Length, } from 'class-validator';

export class Merchandise {

    @Length(2, 80)
    name: string;
  
    @IsDefined()
    quantity: number;

    @IsDefined()
    price: number;
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
