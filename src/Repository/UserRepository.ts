import { MongoRepository, EntityRepository , DeleteResult, DeepPartial } from 'typeorm';
import { Service } from 'typedi';
import { User } from '../entity/User';

@Service()
@EntityRepository(User)
export class UserRepository extends MongoRepository<User>  {

}