import {validateOrReject, IsEmail, Validate, IsDefined} from 'class-validator';

export class UserAuthenticationDto {

  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  password: string;

  async validate() {
    await validateOrReject(this);
  }
}
