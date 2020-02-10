import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, IsDefined, Length, IsEnum } from 'class-validator';
import { UserRole } from '../enum/UserRole';

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;
  
  @Column()
  @IsDefined()
  @Length(2, 60)
  firstName: string;

  @Column()
  @IsDefined()
  @Length(2, 60)
  lastName: string;
  
  @Column()
  @IsDefined()
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
