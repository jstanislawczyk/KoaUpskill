import { User } from "../../entity/User";
import { UserRole } from "../../enum/UserRole";
import { UserDto } from "../../dto/UserDto";

export class UserDataGenerator {
    public static createUser(firstName: string, lastName: string, role: UserRole): User {
        const user: User = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;

        return user;
    }

    public static createUserDto(firstName: string, lastName: string, role: UserRole): UserDto {
        const userDto: UserDto = new UserDto();

        userDto.firstName = firstName;
        userDto.lastName = lastName;
        userDto.role = role;

        return userDto;
    }
}
