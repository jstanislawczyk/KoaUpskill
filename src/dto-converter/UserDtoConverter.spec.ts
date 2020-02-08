import { expect } from 'chai';
import { UserDtoConverter } from './UserDtoConverter';
import { User } from '../entity/User';
import { UserDto } from '../dto/UserDto';
import { UserRole } from '../enum/UserRole';

describe('UserDtoConverter unit tests', () => {

    describe('toDto()', () => {
        it('should return correct dto from user', () => {
            const userToConvert: User = createTestUser('John', 'Doe', UserRole.MANAGER);
            const expectedUserDto: UserDto = createTestUserDto('John', 'Doe', UserRole.MANAGER);
           
            expect(UserDtoConverter.toDto(userToConvert))
                .to.eql(expectedUserDto);
        });

        it('should return correct user from dto', () => {
            const userDtoToConvert: User = createTestUser('John', 'Doe', UserRole.MANAGER);
            const expectedUser: UserDto = createTestUserDto('John', 'Doe', UserRole.MANAGER);
           
            expect(UserDtoConverter.toEntity(userDtoToConvert))
                .to.eql(expectedUser);
        });

        it('should return correct list of user dtos from users list', () => {
            const usersToConvert: User[]  = [
                createTestUser('John', 'Doe', UserRole.MANAGER),
                createTestUser('Jane', 'Test', UserRole.ADMIN),
            ];
            const expectedUserDtos: UserDto[] = [
                createTestUserDto('John', 'Doe', UserRole.MANAGER),
                createTestUser('Jane', 'Test', UserRole.ADMIN),
            ];
           
            expect(UserDtoConverter.toListOfDtos(usersToConvert))
                .to.eql(expectedUserDtos);
        });
    });
});

function createTestUser(firstName: string, lastName: string, role: UserRole): User {
    const user = new User();

    user.id = null;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;

    return user;
}

function createTestUserDto(firstName: string, lastName: string, role: UserRole): UserDto {
    const userDto = new UserDto();

    userDto.id = null;
    userDto.firstName = firstName;
    userDto.lastName = lastName;
    userDto.role = role;

    return userDto;
}