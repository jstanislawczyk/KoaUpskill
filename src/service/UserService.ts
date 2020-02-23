import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import { NotFoundError } from 'routing-controllers/http-error/NotFoundError';
import { DeleteResult } from 'typeorm';
import {sign} from 'jsonwebtoken';
import {BadRequestError, UnauthorizedError} from 'routing-controllers';
import {JsonWebToken} from '../config/helper/JsonWebToken';
import {PasswordHashingUtils} from '../security/PasswordHashingUtils';
import * as config from 'config';

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
            .findUserByEmail(email)
            .then(async (user: User) => {
                const isPasswordEqualToHash: boolean = await PasswordHashingUtils.isPasswordEqualToHash(password, user.password);

                if (isPasswordEqualToHash) {
                    const applicationSecret: string = config.get('security.secret');
                    const tokenBody: JsonWebToken = new JsonWebToken();

                    tokenBody.setupAuthenticationToken(user.id.toHexString());

                    return sign(Object.assign({}, tokenBody), applicationSecret);
                } else {
                    throw new UnauthorizedError('Login failed');
                }
            })
            .catch(() => {
                throw new UnauthorizedError('Login failed');
            });
    }

    async findUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findUserByEmail(email);
    }

    async saveUser(user: User): Promise<User> {
        const userExists: boolean = await this.userRepository.findUserByEmail(user.email) !== undefined;

        if (userExists) {
            throw new BadRequestError(`User with email=${user.email} already exist`);
        } else {
            user.password = await PasswordHashingUtils.hashPassword(user.password);

            return await this.userRepository.save(user);
        }
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
