import * as sinon from 'sinon';
import { UserService } from '../../src/service/UserService';
import { UserRepository } from '../../src/repository/UserRepository';
import * as assert from 'assert';
import { User } from '../../src/entity/User';

describe('Users service', () => {
    it('gets users', async () => {
        const userRepository: UserRepository = new UserRepository();
        const userService: UserService = new UserService(userRepository);
        const user = new User();
        user.name = 'John';
        user.age = 20;

        sinon.stub(userRepository, 'find' as any).returns(user);

        assert.deepEqual(await userService.getAllUsers(), user);
    });
  });

