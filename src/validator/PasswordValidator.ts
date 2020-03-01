import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordValidator', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {

  validate(password: string, args: ValidationArguments): boolean {
    const passwordPattern = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    return passwordPattern.test(password);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Password requires at least one upper case, at least one lower case, at least one digit, 
    at least one special character and minimum length equal to 8`;
  }
}
