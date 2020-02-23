import { UserService } from './UserService';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';
import { UserRole } from '../enum/UserRole';
import {expect} from "chai";
import * as sinon from 'sinon';
import * as assert from 'assert';

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
        it('Should update user', async () => {
            const updatedUser: User = getUser();
            updatedUser.firstName = 'UpdatedFirstName';
            updatedUser.lastName = 'UpdatedLastName';
            updatedUser.role = UserRole.MANAGER;

            sinon.stub(userRepository, 'findOne' as any).resolves(getUser());
            sinon.stub(userRepository, 'save' as any).resolves(updatedUser);

            assert.deepEqual(await userService.updateUser('SomeId', updatedUser), updatedUser);
        });
    });

    describe('saveUser()', () => {
        it('Should save user', async () => {
            const userForSave: User = getUser();
            userForSave.firstName = 'SavedFirstName';
            userForSave.lastName = 'SavedLastName';
            userForSave.role = UserRole.MANAGER;

            sinon.stub(userRepository, 'findUserByEmail' as any).resolves(undefined);
            sinon.stub(userRepository, 'save' as any).resolves(userForSave);

            assert.deepEqual(await userService.saveUser(userForSave), userForSave);
        });
    });

    describe('saveUser() should fail', () => {
        it('Should not save user if email is already in use', async () => {
            const userForSave: User = getUser();
            userForSave.firstName = 'SavedFirstName';
            userForSave.lastName = 'SavedLastName';
            userForSave.role = UserRole.MANAGER;

            sinon.stub(userRepository, 'findOne' as any).resolves(userForSave);
            sinon.stub(userRepository, 'save' as any).resolves(userForSave);

            try {
                await userService.saveUser(userForSave)
                expect.fail();
            } catch (error) {

            }
        });
    });
});

const getMultipleUsers = (): User[] => {
    return [getUser(), getUser()];
};

const getUser = (): User => {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = UserRole.ADMIN;

    return user;
};
