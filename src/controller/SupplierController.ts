import { JsonController, Param, Body, Get, Post, Patch, Delete, HttpCode, NotFoundError } from 'routing-controllers';
import { DeleteResult } from 'typeorm';
import { SupplierService } from '../service/SupplierService';
import { Supplier } from '../entity/Supplier';
import { SupplierDto } from '../dto/SupplierDto';
import { SupplierDtoConverter } from '../dto-converter/SupplierDtoConverter';

@JsonController('/supplier')
export class SupplierController {

    constructor(private readonly supplierService: SupplierService) {
    }

    @Get()
    async getAllUsers(): Promise<SupplierDto[]> {
        return await this.supplierService
            .getAllSuppliers()
            .then(supplier => 
                SupplierDtoConverter.toListOfDtos(supplier)
            );
    }

    @Get('/:id')
    async findOneUser(@Param('id') id: string): Promise<SupplierDto> {
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
    @HttpCode(201)
    async saveUser(@Body({ validate: true }) supplierDto: SupplierDto): Promise<SupplierDto> {
        const supplier: Supplier = SupplierDtoConverter.toEntity(supplierDto);

        return await this.supplierService
            .saveSupplier(supplier)
            .then((supplier: Supplier) => 
                SupplierDtoConverter.toDto(supplier)
            );
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body({ validate: true }) supplierDto: SupplierDto): Promise<SupplierDto> {
        const newUser: Supplier = SupplierDtoConverter.toEntity(supplierDto);

        return await this.supplierService
            .updateUser(id, newUser)
            .then((user: Supplier) => 
                SupplierDtoConverter.toDto(user)
            );
    }

    @Delete('/:id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return await this.supplierService
            .deleteUser(id)
            .catch(() => {
                throw new NotFoundError(`Supplier with id=${id} not found`)
            });
    }
}
