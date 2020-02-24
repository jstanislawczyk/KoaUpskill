import { Application } from '../../src/config/Application';
import { assert } from 'chai';
import { getRepository } from 'typeorm';
import { UserRole } from '../../src/enum/UserRole';
import { User } from '../../src/entity/User';
import { Logger } from '../../src/config/Logger';
import { LoggerLevel } from '../../src/enum/LoggerLevel';
import { UserDtoConverter } from '../../src/dto-converter/UserDtoConverter';
import { UserDataGenerator } from '../util/data-generator/UserDataGenerator';
import { UserDto } from '../../src/dto/UserDto';
import { Error } from '../../src/exception/Error';
import { ErrorDataGenerator } from '../util/data-generator/ErrorDataGenerator';
import {SecurityConfig} from '../util/security/SecurityConfig';
import * as request from 'supertest';

const application: Application = new Application();

describe('Users controller integration test', () => {

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

    describe('GET /api/users', () => {
        it('respond with json containing list of users', async () => {
            const firstUser: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
            const secondUser: User = UserDataGenerator.createUser('test2@mail.com', '1qazXSW@', 'Jane', 'Dane', UserRole.ADMIN);

            const savedUser = await getRepository(User).save(firstUser);
            await getRepository(User).save(secondUser);

            const fakeToken = SecurityConfig.createFakeToken(savedUser.id.toHexString());
            const expectedDtoList: UserDto[] = UserDtoConverter.toListOfDtos([firstUser, secondUser]);
            
            return request(application.appContext)
                .get('/api/users')
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => 
                    assert.deepEqual(response.body, expectedDtoList)
                );
        });
    });

    describe('GET /api/users UNAUTHORIZED', () => {
        it('respond with unauthorized exception', async () => {
            return request(application.appContext)
                .get('/api/users')
                .set({
                    'Accept': 'application/json',
                })
                .expect(401);
        });
    });

    describe('GET /api/user/{id} NOT FOUND', () => {
        it('respond with message about user not found', async () => {
            const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();

            return request(application.appContext)
                .get('/api/users/5e445b53a1bc7a2354236a3a')
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect(404)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(404, 'User with id=5e445b53a1bc7a2354236a3a not found');

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                });
        });
    });

    describe('GET /api/user/{id} UNAUTHORIZED', () => {
        it('respond with message about user not found', async () => {

            return request(application.appContext)
                .get('/api/users/5e445b53a1bc7a2354236a3a')
                .set({
                    'Accept': 'application/json',
                })
                .expect(401);
        });
    });

    describe('GET /api/user/{id}', () => {
        it('respond with json containing user', async () => {
            const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();
            let user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);

            user = await getRepository(User).save(user);

            const expectedDto: UserDto = UserDtoConverter.toDto(user);
            
            return request(application.appContext)
                .get(`/api/users/${user.id}`)
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect(200)
                .then((response: any) => 
                    assert.deepEqual(response.body, expectedDto)
                );
        });
    });

    describe('POST /api/user BAD REQUEST', () => {
        it('respond with bad request error if user already exist', async () => {
            const user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', '', UserRole.MANAGER);
            const alreadyExistedUser: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'Jane', 'Dane', UserRole.ADMIN);

            await getRepository(User).save(alreadyExistedUser);

            return request(application.appContext)
                .post('/api/users')
                .send(user)
                .set('Accept', 'application/json')
                .expect(400); 
        });
    });

    describe('POST /api/user', () => {
        it('respond with json containing saved user', async () => {
            const user: User = UserDataGenerator.createUser('userForSave@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
            const expectedUserDto: UserDto = UserDtoConverter.toDto(user);
            
            return request(application.appContext)
                .post('/api/users')
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .then((response: any) => {
                    const savedUserDto: UserDto = JSON.parse(response.text);
                    
                    assert.isNotNull(savedUserDto.id);
                    assert.equal(savedUserDto.email, expectedUserDto.email);
                    assert.equal(savedUserDto.firstName, expectedUserDto.firstName);
                    assert.equal(savedUserDto.lastName, expectedUserDto.lastName);
                    assert.equal(savedUserDto.role, expectedUserDto.role);
                });
                    
        });
    });

    describe('PATCH /api/user/{id} FORBIDDEN', () => {
        it('respond with message about forbidden editing other user account', async () => {
            const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();
            const user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
            
            return request(application.appContext)
                .patch('/api/users/5e445b53a1bc7a2354236a3a')
                .send(user)
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect(403)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(403, `Can't update different user`);

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                });
        });
    });

    describe('PATCH /api/user/{id} UNAUTHORIZED', () => {
        it('respond with message about user not found', async () => {
            const user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);

            return request(application.appContext)
                .patch('/api/users/5e445b53a1bc7a2354236a3a')
                .send(user)
                .set({
                    'Accept': 'application/json',
                })
                .expect(401);
        });
    });

    describe('PATCH /api/user/{id} BAD REQUEST', () => {
        it('respond with message about user bad request', async () => {
            const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();
            const user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', '', UserRole.MANAGER);
            
            return request(application.appContext)
                .patch('/api/users/5e445b53a1bc7a2354236a3a')
                .send(user)
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect(400);
        });
    });

    describe('PATCH /api/user/{id}', () => {
        it('respond with json containing updated user', async () => {
            const userBodyForUpdate: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'Jane', 'Test', UserRole.ADMIN);
            let user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);

            user = await getRepository(User).save(user);

            const fakeToken = await SecurityConfig.createFakeToken(user.id.toHexString());
            const expectedDto: UserDto = UserDtoConverter.toDto(userBodyForUpdate);
            expectedDto.id = user.id.toHexString();
            
            return request(application.appContext)
                .patch(`/api/users/${user.id}`)
                .send(userBodyForUpdate)
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => {
                    const savedUserDto: UserDto = response.body;

                    assert.deepEqual(savedUserDto, expectedDto);
                });
        });
    });

    describe('DELETE /api/user/{id} NOT FOUND', () => {
        it('respond with message about user not found', async () => {
            const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();

            return request(application.appContext)
                .delete('/api/users/5e445b53a1bc7a2354236a3a')
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect(404)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(404, 'User with id=5e445b53a1bc7a2354236a3a not found');

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                });
        });
    });

    describe('DELETE /api/user/{id} UNAUTHORIZED', () => {
        it('respond with message about user not found', async () => {
            return request(application.appContext)
                .delete('/api/users/5e445b53a1bc7a2354236a3a')
                .set({
                    'Accept': 'application/json',
                })
                .expect(401);
        });
    });

    describe('DELETE /api/user/{id}', () => {
        it('respond with message about user not found', async () => {
            const fakeToken = await SecurityConfig.createFakeTokenWithoutUser();
            let user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);

            user = await getRepository(User)
                .save(user)
                .then(user => user);

            return request(application.appContext)
                .delete(`/api/users/${user.id}`)
                .set({
                    'Authorization': `Bearer ${fakeToken}`,
                    'Accept': 'application/json',
                })
                .expect(204);
        });
    });
});
