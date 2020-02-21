import { UserDto } from '../dto/UserDto';
import { User } from '../entity/User';

export class UserDtoConverter {

    public static toDto(user: User): UserDto {
        const newUserDto = new UserDto();

        newUserDto.id = user.id 
            ? user.id.toHexString() 
            : '';
        newUserDto.email = user.email;
        newUserDto.role = user.role;
        newUserDto.firstName = user.firstName;
        newUserDto.lastName = user.lastName;

        return newUserDto;
    }

    public static toEntity(userDto: UserDto): User {
        const newUser = new User();

        newUser.email = userDto.email;
        newUser.password = userDto.password;
        newUser.firstName = userDto.firstName;
        newUser.lastName = userDto.lastName;
        newUser.role = userDto.role;

        return newUser;
    }

    public static toListOfDtos(users: User[]): UserDto[] {
        return users.map(user => 
            this.toDto(user)
        );
    }
}
