import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import { NotFoundError } from 'routing-controllers/http-error/NotFoundError';

@Service()
export class UserService {

    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
    ) {}

    async getAllUsers() {
        return await this.userRepository.find();
    }

    async findOneUser(id: string) {
        return await this.userRepository.findOne(id);
    }

    async saveUser(user: User) {
        return await this.userRepository.save(user);
    }

    async updateUser(id: string, newUser: User) {
        return <User> await this.userRepository
            .findOne(id)
            .then(userToUpdate => {
                userToUpdate.name = newUser.name;
                userToUpdate.age = newUser.age;

                return this.userRepository.save(userToUpdate);
            })
            .catch(() => {
                throw new NotFoundError(`User with id=${id} not found`)
            });
    }

    async deleteUser(id: string) {
        return await this.userRepository.delete(id);
    }
}
