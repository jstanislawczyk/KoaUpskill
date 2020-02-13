import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { NotFoundError } from 'routing-controllers/http-error/NotFoundError';
import { DeleteResult } from 'typeorm';
import { Supplier } from '../entity/Supplier';
import { SupplierRepository } from '../repository/SupplierRepository';

@Service()
export class SupplierService {

    constructor(
        @InjectRepository()
        private readonly supplierRepository: SupplierRepository,
    ) {}

    async getAllSuppliers(): Promise<Supplier[]> {
        return await this.supplierRepository.find();
    }

    async findOneSupplier(id: string): Promise<Supplier> {
        return await this.supplierRepository.findOne(id);
    }

    async saveSupplier(supplier: Supplier): Promise<Supplier> {
        return await this.supplierRepository.save(supplier);
    }

    async updateUser(id: string, newSupplier: Supplier): Promise<Supplier> {
        return <Supplier> await this.supplierRepository
            .findOne(id)
            .then((supplierToUpdate: Supplier) => {
                supplierToUpdate.nip = newSupplier.nip ? newSupplier.nip : supplierToUpdate.nip;
                supplierToUpdate.name = newSupplier.name ? newSupplier.name : supplierToUpdate.name;

                return this.supplierRepository.save(supplierToUpdate);
            })
            .catch(() => {
                throw new NotFoundError(`Supplier with id=${id} not found`)
            });
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return <DeleteResult> await this.supplierRepository
            .findOne(id)
            .then((supplierToDelete: Supplier) => 
                this.supplierRepository.delete(supplierToDelete.id)
            )
            .catch(() => {
                throw new NotFoundError(`Supplier with id=${id} not found`);
            });
    }
}
