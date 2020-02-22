import { MongoRepository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { User } from '../entity/User';

@Service()
@EntityRepository(User)
export class UserRepository extends MongoRepository<User>  {

  findUserByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.findOneOrFail({
      email: email,
      password: password,
    });
  }

  findUserByEmail(email: string): Promise<User> {
    return this.findOneOrFail({
      email: email,
    });
  }
}
