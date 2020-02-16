import { MongoRepository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { Invoice } from '../entity/Invoice';

@Service()
@EntityRepository(Invoice)
export class InvoiceRepository extends MongoRepository<Invoice>  {

    findAllBySupplier(supplierId: string) {
        return this.find({ supplierId: supplierId });
    }

    findAllByManager(managerId: string) {
        return this.find({ managerId: managerId });
    }
}