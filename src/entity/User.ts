import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import {
  validateOrReject,
  IsDefined,
  Length,
  IsEnum,
  IsEmail,
  MinLength,
  Validate
} from 'class-validator';
import { UserRole } from '../enum/UserRole';
import {PasswordValidator} from '../validator/PasswordValidator';

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Validate(PasswordValidator)
  password: string;
  
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
