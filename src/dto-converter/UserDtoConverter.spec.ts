import { expect } from 'chai';
import { UserDtoConverter } from './UserDtoConverter';
import { User } from '../entity/User';
import { UserDto } from '../dto/UserDto';
import { UserRole } from '../enum/UserRole';

describe('UserDtoConverter unit tests', () => {

    describe('toDto()', () => {
        it('should return correct dto from user', () => {
            const userToConvert: User = createTestUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
            const expectedUserDto: UserDto = createTestUserDto('test@mail.com', 'John', 'Doe', UserRole.MANAGER);
           
            expect(UserDtoConverter.toDto(userToConvert))
                .to.eql(expectedUserDto);
        });
    });

    describe('toEntity()', () => {
        it('should return correct user from dto', () => {
            const expectedUser: User = createTestUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
            const userDtoToConvert: UserDto = createTestUserDtoWithPassword('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
           
            expect(UserDtoConverter.toEntity(userDtoToConvert))
                .to.eql(expectedUser);
        });
    });

    describe('toListOfDtos()', () => {
        it('should return correct list of user dtos from users list', () => {
            const usersToConvert: User[]  = [
                createTestUser('test@mail.com','1qazXSW@', 'John', 'Doe', UserRole.MANAGER),
                createTestUser('test@mail.com','1qazXSW@', 'Jane', 'Test', UserRole.ADMIN),
            ];
            const expectedUserDtos: UserDto[] = [
                createTestUserDto('test@mail.com','John', 'Doe', UserRole.MANAGER),
                createTestUserDto('test@mail.com','Jane', 'Test', UserRole.ADMIN),
            ];
           
            expect(UserDtoConverter.toListOfDtos(usersToConvert))
                .to.eql(expectedUserDtos);
        });
    });
});

const createTestUser = (email: string, password: string, firstName: string, lastName: string, role: UserRole): User => {
    const user = new User();

    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;

    return user;
};

const createTestUserDto = (email: string, firstName: string, lastName: string, role: UserRole): UserDto => {
    const userDto = new UserDto();

    userDto.id = '';
    userDto.email = email;
    userDto.firstName = firstName;
    userDto.lastName = lastName;
    userDto.role = role;

    return userDto;
};

const createTestUserDtoWithPassword = (email: string, password: string, firstName: string, lastName: string, role: UserRole): UserDto => {
    const userDto = new UserDto();

    userDto.email = email;
    userDto.password = password;
    userDto.firstName = firstName;
    userDto.lastName = lastName;
    userDto.role = role;

    return userDto;
};
