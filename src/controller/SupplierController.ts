import {
    JsonController,
    Param,
    Body,
    Get,
    Post,
    Patch,
    Delete,
    HttpCode,
    NotFoundError,
    Authorized
} from 'routing-controllers';
import { DeleteResult } from 'typeorm';
import { SupplierService } from '../service/SupplierService';
import { Supplier } from '../entity/Supplier';
import { SupplierDto } from '../dto/SupplierDto';
import { SupplierDtoConverter } from '../dto-converter/SupplierDtoConverter';

@JsonController('/api/suppliers')
export class SupplierController {

    constructor(private readonly supplierService: SupplierService) {
    }

    @Get()
    @Authorized()
    async getAllSuppliers(): Promise<SupplierDto[]> {
        return await this.supplierService
            .getAllSuppliers()
            .then((suppliers: Supplier[]) => 
                SupplierDtoConverter.toListOfDtos(suppliers)
            );
    }

    @Get('/:id')
    @Authorized()
    async findOneSupplier(@Param('id') id: string): Promise<SupplierDto> {
        return await this.supplierService
            .findOneSupplier(id)
            .then((supplier: Supplier) => 
                SupplierDtoConverter.toDto(supplier)
            )
            .catch(() => {
                throw new NotFoundError(`Supplier with id=${id} not found`);
            });
    }

    @Post()
    @Authorized()
    @HttpCode(201)
    async saveSupplier(@Body({ validate: true }) supplierDto: SupplierDto): Promise<SupplierDto> {
        const supplier: Supplier = SupplierDtoConverter.toEntity(supplierDto);

        return await this.supplierService
            .saveSupplier(supplier)
            .then((supplier: Supplier) => 
                SupplierDtoConverter.toDto(supplier)
            );
    }

    @Patch('/:id')
    @Authorized()
    async updateSupplier(@Param('id') id: string, @Body({ validate: true }) supplierDto: SupplierDto): Promise<SupplierDto> {
        const newUser: Supplier = SupplierDtoConverter.toEntity(supplierDto);

        return await this.supplierService
            .updateSupplier(id, newUser)
            .then((user: Supplier) => 
                SupplierDtoConverter.toDto(user)
            );
    }

    @Delete('/:id')
    @Authorized()
    @HttpCode(204)
    async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return await this.supplierService
            .deleteUser(id)
            .catch(() => {
                throw new NotFoundError(`Supplier with id=${id} not found`)
            });
    }
}
