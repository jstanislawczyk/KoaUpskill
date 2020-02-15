import { Supplier } from "../entity/Supplier";
import { SupplierDto } from "../dto/SupplierDto";

export class SupplierDtoConverter {

    public static toDto(supplier: Supplier): SupplierDto {
        const supplierDto = new SupplierDto();

        supplierDto.id = supplier.id 
            ? supplier.id.toHexString() 
            : '';
        supplierDto.name = supplier.name;
        supplierDto.nip = supplier.nip;

        return supplierDto;
    }

    public static toEntity(supplierDto: SupplierDto): Supplier {
        const supplier = new Supplier();

        supplier.name = supplierDto.name;
        supplier.nip = supplierDto.nip;

        return supplier;
    }

    public static toListOfDtos(suppliers: Supplier[]): SupplierDto[] {
        return suppliers.map(supplier => 
            this.toDto(supplier)
        );
    }
}
