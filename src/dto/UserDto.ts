import { ObjectID, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, Length, IsEnum } from 'class-validator';
import { UserRole } from '../enum/UserRole';

export class UserDto {

    id: ObjectID;
  
    @Length(2, 60)
    firstName: string;

    @Length(2, 60)
    lastName: string;
    
    @IsEnum(UserRole)
    role: UserRole;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
      await validateOrReject(this);
    }
}
