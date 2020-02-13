import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, IsDefined, Length, IsNumberString } from 'class-validator';

@Entity()
export class Supplier {

  @ObjectIdColumn()
  id: ObjectID;
  
  @Column()
  @IsDefined()
  @Length(2, 60)
  name: string;

  @Column()
  @IsDefined()
  @Length(10)
  @IsNumberString()
  nip: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
