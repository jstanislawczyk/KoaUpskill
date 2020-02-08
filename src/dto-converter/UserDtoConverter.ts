import { UserDto } from '../dto/UserDto';
import { User } from '../entity/User';

export class UserDtoConverter {

    public static toDto(user: User): UserDto {
        const newUserDto = new UserDto();

        newUserDto.id = user.id;
        newUserDto.firstName = user.firstName;
        newUserDto.lastName = user.lastName;
        newUserDto.role = user.role;

        return newUserDto;
    }

    public static toEntity(user: User): UserDto {
        const newUserDto = new UserDto();
        
        newUserDto.id = user.id;
        newUserDto.firstName = user.firstName;
        newUserDto.lastName = user.lastName;
        newUserDto.role = user.role;

        return newUserDto;
    }

    public static toListOfDtos(users: User[]): UserDto[] {
        return users.map(user => 
            this.toDto(user)
        );
    }
}