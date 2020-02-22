import { User } from "../../../src/entity/User";
import { UserRole } from "../../../src/enum/UserRole";
import { UserDto } from "../../../src/dto/UserDto";

export class UserDataGenerator {
    public static createUser(email: string, password: string, firstName: string, lastName: string, role: UserRole): User {
        const user: User = new User();

        user.email = email;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;

        return user;
    }

    public static createUserDto(email: string, firstName: string, lastName: string, role: UserRole): UserDto {
        const userDto: UserDto = new UserDto();

        userDto.email = email;
        userDto.firstName = firstName;
        userDto.lastName = lastName;
        userDto.role = role;

        return userDto;
    }

    public static createUserDtoWithPassword(email: string, password: string, firstName: string, lastName: string, role: UserRole): UserDto {
        const userDto: UserDto = new UserDto();

        userDto.email = email;
        userDto.password = password;
        userDto.firstName = firstName;
        userDto.lastName = lastName;
        userDto.role = role;

        return userDto;
    }
}
