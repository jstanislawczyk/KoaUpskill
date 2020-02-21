import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import { NotFoundError } from 'routing-controllers/http-error/NotFoundError';
import { DeleteResult } from 'typeorm';
import * as config from 'config';
import {sign} from 'jsonwebtoken';
import {UnauthorizedError} from 'routing-controllers';
import {JsonWebToken} from "../config/helper/JsonWebToken";

@Service()
export class UserService {

    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOneUser(id: string): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async authenticateUser(email: string, password: string): Promise<string> {
        return await this.userRepository
            .findUserByEmailAndPassword(email, password)
            .then((user: User) => {
                const applicationSecret: string = config.get('security.secret');
                const tokenBody: JsonWebToken = new JsonWebToken();

                tokenBody.setupAuthenticationToken(user.id.toHexString());

                return sign(Object.assign({}, tokenBody), applicationSecret);
            })
            .catch(() => {
                throw new UnauthorizedError('Login failed');
            });
    }

    async findUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findUserByEmail(email);
    }

    async saveUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async updateUser(id: string, newUser: User): Promise<User> {
        return <User> await this.userRepository
            .findOne(id)
            .then((userToUpdate: User) => {
                userToUpdate.firstName = newUser.firstName ? newUser.firstName : userToUpdate.firstName;
                userToUpdate.lastName = newUser.lastName ? newUser.lastName : userToUpdate.lastName;
                userToUpdate.role = newUser.role ? newUser.role : userToUpdate.role;

                return this.userRepository.save(userToUpdate);
            })
            .catch(() => {
                throw new NotFoundError(`User with id=${id} not found`)
            });
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return <DeleteResult> await this.userRepository
            .findOne(id)
            .then((userToDelete: User) => 
                this.userRepository.delete(userToDelete.id)
            )
            .catch(() => {
                throw new NotFoundError(`User with id=${id} not found`);
            });
    }
}
