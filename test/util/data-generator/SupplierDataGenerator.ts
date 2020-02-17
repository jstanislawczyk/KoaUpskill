import { Supplier } from "../../../src/entity/Supplier";
import { SupplierDto } from "../../../src/dto/SupplierDto";

export class SupplierDataGenerator {
    public static createSupplier(name: string, nip: string): Supplier {
        const supplier: Supplier = new Supplier();

        supplier.name = name;
        supplier.nip = nip;

        return supplier;
    }

    public static createSupplierDto(name: string, nip: string): SupplierDto {
        const supplierDto: SupplierDto = new SupplierDto();

        supplierDto.name = name;
        supplierDto.nip = nip;

        return supplierDto;
    }
}
