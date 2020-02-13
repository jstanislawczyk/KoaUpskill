import { expect } from 'chai';
import { Supplier } from '../entity/Supplier';
import { SupplierDto } from '../dto/SupplierDto';
import { SupplierDtoConverter } from './SupplierDtoConverter';

describe('SupplierDtoConverter unit tests', () => {

    describe('toDto()', () => {
        it('should return correct dto from supplier', () => {
            const userToConvert: Supplier = createTestSupplier('TestSupplier', '1234567890');
            const expectedUserDto: SupplierDto = createTestSupplierDto('TestSupplier', '1234567890');
           
            expect(SupplierDtoConverter.toDto(userToConvert))
                .to.eql(expectedUserDto);
        });
    });

    describe('toEntity()', () => {
        it('should return correct supplier from dto', () => {
            const userToConvert: Supplier = createTestSupplier('TestSupplier', '1234567890');
            const expectedUserDto: SupplierDto = createTestSupplierDto('TestSupplier', '1234567890');
           
            expect(SupplierDtoConverter.toEntity(expectedUserDto))
                .to.eql(userToConvert);
        });
    });

    describe('toListOfDtos()', () => {
        it('should return correct list of supplier dtos from users list', () => {
            const usersToConvert: Supplier[]  = [
                createTestSupplier('TestSupplier', '1234567890'),
                createTestSupplier('SomeSupplier', '0987654321'),
            ];
            const expectedUserDtos: SupplierDto[] = [
                createTestSupplierDto('TestSupplier', '1234567890'),
                createTestSupplierDto('SomeSupplier', '0987654321'),
            ];
           
            expect(SupplierDtoConverter.toListOfDtos(usersToConvert))
                .to.eql(expectedUserDtos);
        });
    });
});

function createTestSupplier(name: string, nip: string): Supplier {
    const supplier = new Supplier();
    
    supplier.name = name;
    supplier.nip = nip;

    return supplier;
}

function createTestSupplierDto(name: string, nip: string): SupplierDto {
    const supplierDto = new SupplierDto();

    supplierDto.id = '';
    supplierDto.name = name;
    supplierDto.nip = nip;

    return supplierDto;
}
