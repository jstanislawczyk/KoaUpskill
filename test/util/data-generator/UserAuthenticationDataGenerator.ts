import {UserAuthenticationDto} from '../../../src/dto/UserAuthenticationDto';

export class UserAuthenticationDataGenerator {
    public static createUserAuthentication(email: string, password: string): UserAuthenticationDto {
        const userAuthenticationDto: UserAuthenticationDto = new UserAuthenticationDto();

        userAuthenticationDto.email = email;
        userAuthenticationDto.password = password;

        return userAuthenticationDto;
    }
}
