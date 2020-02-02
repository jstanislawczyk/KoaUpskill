import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, IsDefined } from 'class-validator';

@Entity()
export class User {
  
  @ObjectIdColumn()
  id: ObjectID;
  
  @Column({ length: 100 })
  @IsDefined()
  name: string;
  
  @Column()
  @IsDefined()
  age: number;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
