import { ObjectID, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject, Length } from 'class-validator';
import { UserRole } from '../enum/UserRole';

export class UserDto {

    id: ObjectID;
  
    @Length(2, 60)
    firstName: string;

    @Length(2, 60)
    lastName: string;
    
    role: UserRole;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
      await validateOrReject(this);
    }
}
