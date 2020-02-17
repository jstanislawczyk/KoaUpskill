import { expect } from 'chai';
import { Supplier } from '../entity/Supplier';
import { SupplierDto } from '../dto/SupplierDto';
import { SupplierDtoConverter } from './SupplierDtoConverter';

describe('SupplierDtoConverter unit tests', () => {

    describe('toDto()', () => {
        it('should return correct dto from supplier', () => {
            const supplierToConvert: Supplier = createTestSupplier('TestSupplier', '1234567890');
            const expectedSupplierDto: SupplierDto = createTestSupplierDto('TestSupplier', '1234567890');
           
            expect(SupplierDtoConverter.toDto(supplierToConvert))
                .to.eql(expectedSupplierDto);
        });
    });

    describe('toEntity()', () => {
        it('should return correct supplier from dto', () => {
            const expectedSupplier: Supplier = createTestSupplier('TestSupplier', '1234567890');
            const supplierDtoToConvert: SupplierDto = createTestSupplierDto('TestSupplier', '1234567890');
           
            expect(SupplierDtoConverter.toEntity(supplierDtoToConvert))
                .to.eql(expectedSupplier);
        });
    });

    describe('toListOfDtos()', () => {
        it('should return correct list of supplier dtos from users list', () => {
            const suppliersToConvert: Supplier[]  = [
                createTestSupplier('TestSupplier', '1234567890'),
                createTestSupplier('SomeSupplier', '0987654321'),
            ];
            const expectedSupplierDtos: SupplierDto[] = [
                createTestSupplierDto('TestSupplier', '1234567890'),
                createTestSupplierDto('SomeSupplier', '0987654321'),
            ];
           
            expect(SupplierDtoConverter.toListOfDtos(suppliersToConvert))
                .to.eql(expectedSupplierDtos);
        });
    });
});

const createTestSupplier = (name: string, nip: string): Supplier => {
    const supplier = new Supplier();
    
    supplier.name = name;
    supplier.nip = nip;

    return supplier;
}

const createTestSupplierDto = (name: string, nip: string): SupplierDto => {
    const supplierDto = new SupplierDto();

    supplierDto.id = '';
    supplierDto.name = name;
    supplierDto.nip = nip;

    return supplierDto;
}
