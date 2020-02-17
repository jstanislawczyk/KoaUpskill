import * as sinon from 'sinon';
import { UserService } from './UserService';
import { UserRepository } from '../repository/UserRepository';
import * as assert from 'assert';
import { User } from '../entity/User';
import { UserRole } from '../enum/UserRole';

describe('Users service', () => {
    let userRepository: UserRepository = new UserRepository();
    let userService: UserService = new UserService(userRepository);

    beforeEach(() => {
        userRepository = new UserRepository();
        userService = new UserService(userRepository);
    });

    describe('getAllUsers()', () => {
        it('Should return all users', async () => {
            sinon.stub(userRepository, 'find' as any).resolves(getMultipleUsers());

            assert.deepEqual(await userService.getAllUsers(), getMultipleUsers());
        });
    });

    describe('getAllUsers() empty', () => {
        it('Should get empty users list', async () => {
            sinon.stub(userRepository, 'find' as any).resolves([]);

            assert.deepEqual(await userService.getAllUsers(), []);
        });
    });

    describe('findOneUser()', () => {
        it('Should find one user', async () => {
            sinon.stub(userRepository, 'findOne' as any).resolves(getUser());

            assert.deepEqual(await userService.findOneUser('Som3ID'), getUser());
        });
    });

    describe('updateUser()', () => {
        it('Should update user', async () => {const updatedUser: User = getUser();
            updatedUser.firstName = 'UpdatedFirstName';
            updatedUser.lastName = 'UpdatedLastName';
            updatedUser.role = UserRole.MANAGER;

            sinon.stub(userRepository, 'findOne' as any).resolves(getUser());
            sinon.stub(userRepository, 'save' as any).resolves(updatedUser);

            assert.deepEqual(await userService.saveUser(updatedUser), updatedUser);
        });
    });
});

const getMultipleUsers = (): User[] => {
    return [getUser(), getUser()];
}

const getUser = (): User => {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = UserRole.ADMIN;

    return user;
}
