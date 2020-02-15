import { MongoRepository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { Supplier } from '../entity/Supplier';

@Service()
@EntityRepository(Supplier)
export class SupplierRepository extends MongoRepository<Supplier>  {

}
