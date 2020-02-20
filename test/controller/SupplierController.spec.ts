import { Application } from '../../src/config/Application';
import { assert } from 'chai';
import * as request from 'supertest';
import { getRepository } from 'typeorm';
import { UserRole } from '../../src/enum/UserRole';
import { User } from '../../src/entity/User';
import { Logger } from '../../src/config/Logger';
import { LoggerLevel } from '../../src/enum/LoggerLevel';
import { UserDataGenerator } from '../util/data-generator/UserDataGenerator';
import { Error } from '../../src/exception/Error';
import { ErrorDataGenerator } from '../util/data-generator/ErrorDataGenerator';
import { Supplier } from '../../src/entity/Supplier';
import { SupplierDataGenerator } from '../util/data-generator/SupplierDataGenerator';
import { SupplierDtoConverter } from '../../src/dto-converter/SupplierDtoConverter';
import { SupplierDto } from '../../src/dto/SupplierDto';

const application: Application = new Application();

describe('Suppliers controller integration test', () => {

    before(async () => {
        await application.start();
    });

    beforeEach(async () => {
        return await application.databaseConnection
            .synchronize(true)
            .catch(error => 
                Logger.log(`Test database error: ${error}`, LoggerLevel.ERROR)
            );
    });

    after(async () => {
        await application.close();
    });

    describe('GET /api/suppliers', () => {
        it('respond with json containing an empty list of suppliers', async () => {
            return request(application.appContext)
                .get('/api/suppliers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => {
                    assert.deepEqual(response.body, []);
                })
        });
    });

    describe('GET /api/suppliers', () => {
        it('respond with json containing list of users', async () => {
            const firstSupplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
            const secondSupplier: Supplier = SupplierDataGenerator.createSupplier('TestTest2', '0987654321');

            await getRepository(Supplier).save(firstSupplier);
            await getRepository(Supplier).save(secondSupplier);

            const expectedDtoList: SupplierDto[] = SupplierDtoConverter.toListOfDtos([firstSupplier, secondSupplier]);
            
            return request(application.appContext)
                .get('/api/suppliers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => 
                    assert.deepEqual(response.body, expectedDtoList)
                )
        });
    });

    describe('GET /api/suppliers/{id} NOT FOUND', () => {
        it('respond with message about suppliers not found', async () => {
            return request(application.appContext)
                .get('/api/suppliers/5e445b53a1bc7a2354236a3a')
                .set('Accept', 'application/json')
                .expect(404)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Supplier with id=5e445b53a1bc7a2354236a3a not found');

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                })
        });
    });

    describe('GET /api/suppliers/{id}', () => {
        it('respond with json containing supplier', async () => {
            let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');

            supplier = await getRepository(Supplier)
                .save(supplier)
                .then(supplier => supplier);

            const expectedDto: SupplierDto = SupplierDtoConverter.toDto(supplier);
            
            return request(application.appContext)
                .get(`/api/suppliers/${supplier.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => 
                    assert.deepEqual(response.body, expectedDto)
                )
        });
    });

    describe('POST /api/suppliers BAD REQUEST', () => {
        it('respond with bad request error', async () => {
            const user: User = UserDataGenerator.createUser('John', '', UserRole.MANAGER);
            
            return request(application.appContext)
                .post('/api/suppliers')
                .send(user)
                .set('Accept', 'application/json')
                .expect(400); 
        });
    });

    describe('POST /api/suppliers', () => {
        it('respond with json containing saved supplier', async () => {
            const supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
            const expectedSupplierDto: SupplierDto = SupplierDtoConverter.toDto(supplier);
            
            return request(application.appContext)
                .post('/api/suppliers')
                .send(supplier)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .then((response: any) => {
                    const savedSupplierDto: SupplierDto = JSON.parse(response.text);
                    
                    assert.isNotNull(savedSupplierDto.id);
                    assert.equal(savedSupplierDto.name, expectedSupplierDto.name);
                    assert.equal(savedSupplierDto.nip, expectedSupplierDto.nip);
                });
                    
        });
    });

    describe('PATCH /api/suppliers/{id} NOT FOUND', () => {
        it('respond with message about suppliers not found', async () => {
            const supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '1234567890');
            
            return request(application.appContext)
                .patch('/api/suppliers/5e445b53a1bc7a2354236a3a')
                .send(supplier)
                .set('Accept', 'application/json')
                .expect(404)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Supplier with id=5e445b53a1bc7a2354236a3a not found');

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                })
        });
    });

    describe('PATCH /api/suppliers/{id} BAD REQUEST', () => {
        it('respond with message about supplier bad request', async () => {
            const supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest1', '123');
            
            return request(application.appContext)
                .patch('/api/suppliers/5e445b53a1bc7a2354236a3a')
                .send(supplier)
                .set('Accept', 'application/json')
                .expect(400);
        });
    });

    describe('PATCH /api/suppliers/{id}', () => {
        it('respond with json containing updated supplier', async () => {
            const supplierBodyForUpdate: Supplier = SupplierDataGenerator.createSupplier('UpdatedTest', '1234567890');
            let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest', '0987654321');

            supplier = await getRepository(Supplier)
                .save(supplier)
                .then(supplier => supplier);

            const expectedDto: SupplierDto = SupplierDtoConverter.toDto(supplierBodyForUpdate);
            expectedDto.id = supplier.id.toHexString();
            
            return request(application.appContext)
                .patch(`/api/suppliers/${supplier.id}`)
                .send(supplierBodyForUpdate)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => {
                    const savedSupplierDto: SupplierDto = response.body;

                    assert.deepEqual(savedSupplierDto, expectedDto);
                })
        });
    });

    describe('DELETE /api/suppliers/{id} NOT FOUND', () => {
        it('respond with message about supplier not found', async () => {
            return request(application.appContext)
                .delete('/api/suppliers/5e445b53a1bc7a2354236a3a')
                .set('Accept', 'application/json')
                .expect(404)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(404, 'Supplier with id=5e445b53a1bc7a2354236a3a not found');

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                })
        });
    });

    describe('DELETE /api/suppliers/{id}', () => {
        it('respond with message about supplier not found', async () => {
            let supplier: Supplier = SupplierDataGenerator.createSupplier('TestTest', '0987654321');

            supplier = await getRepository(Supplier)
                .save(supplier)
                .then(supplier => supplier);

            return request(application.appContext)
                .delete(`/api/suppliers/${supplier.id}`)
                .set('Accept', 'application/json')
                .expect(204);
        });
    });
});
