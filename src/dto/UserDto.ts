import {validateOrReject, Length, IsEnum, IsEmail, Validate} from 'class-validator';
import {UserRole} from '../enum/UserRole';

export class UserDto {

    id: string;

    @IsEmail()
    email: string;

    password: string;

    @Length(2, 60)
    firstName: string;

    @Length(2, 60)
    lastName: string;
    
    @IsEnum(UserRole)
    role: UserRole;

    async validate() {
      await validateOrReject(this);
    }
}
