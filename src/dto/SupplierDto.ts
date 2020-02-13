import { validateOrReject, Length, IsNumberString } from 'class-validator';

export class SupplierDto {

  id: string;
  
  @Length(2, 60)
  name: string;

  @Length(10)
  @IsNumberString()
  nip: string;

  async validate() {
    await validateOrReject(this);
  }
}
