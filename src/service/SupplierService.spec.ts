import * as sinon from 'sinon';
import * as assert from 'assert';
import { Supplier } from '../entity/Supplier';
import { SupplierRepository } from '../repository/SupplierRepository';
import { SupplierService } from './SupplierService';

describe('Supplier service', () => {
    let supplierRepository: SupplierRepository;
    let supplierService: SupplierService;

    beforeEach(() => {
        supplierRepository = new SupplierRepository();
        supplierService = new SupplierService(supplierRepository);    
    });

    describe('getAllSuppliers()', () => {
        it('Should return all suppliers', async () => {
            sinon.stub(supplierRepository, 'find' as any).resolves([getSupplier(), getSupplier()]);

            assert.deepEqual(await supplierService.getAllSuppliers(), [getSupplier(), getSupplier()]);
        });
    });

    describe('getAllSuppliers() empty', () => {
        it('Should get empty suppliers list', async () => {
            sinon.stub(supplierRepository, 'find' as any).resolves([]);

            assert.deepEqual(await supplierService.getAllSuppliers(), []);
        });
    });

    describe('findOneUser()', () => {
        it('Should find one user', async () => {
            sinon.stub(supplierRepository, 'findOne' as any).resolves(getSupplier());

            assert.deepEqual(await supplierService.findOneSupplier('Som3ID'), getSupplier());
        });
    });

    describe('updateSupplier()', () => {
        it('Should update supplier', async () => {
            const updatedSupplier: Supplier = getSupplier();
            updatedSupplier.name = 'UpdatedName';
            updatedSupplier.nip = '0987654321';

            sinon.stub(supplierRepository, 'findOne' as any).resolves(getSupplier());
            sinon.stub(supplierRepository, 'save' as any).resolves(updatedSupplier);

            assert.deepEqual(await supplierService.saveSupplier(updatedSupplier), updatedSupplier);
        });
    });
});

const getSupplier = (): Supplier => {
    const supplier = new Supplier();

    supplier.name = 'SomeSupplier';
    supplier.nip = '1234567890';

    return supplier;
}
