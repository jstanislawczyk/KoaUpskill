import { Application } from '../../src/config/Application';
import { assert } from 'chai';
import * as request from 'supertest';
import { getRepository } from 'typeorm';
import { UserRole } from '../../src/enum/UserRole';
import { User } from '../../src/entity/User';
import { Logger } from '../../src/config/Logger';
import { LoggerLevel } from '../../src/enum/LoggerLevel';
import { UserDtoConverter } from '../../src/dto-converter/UserDtoConverter';

const application: Application = new Application();
const applicationStartContext = application.start();

describe('Users controller integration test', () => {
    beforeEach(async () => {
        return await application.databaseConnection
            .synchronize(true)
            .catch(error => 
                Logger.log(`Test database error: ${error}`, LoggerLevel.ERROR)
            );
    });

    describe('GET /api/users', () => {
        it('respond with json containing an empty list of users', async () => {
            await applicationStartContext;
           
            return request(application.appContext)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => {
                    assert.deepEqual(response.body, []);
                })
        });
    });

    describe('GET /api/users', () => {
        it('respond with json containing list of users', async () => {
            await applicationStartContext;

            const user: User = new User();
            user.firstName = 'TT1';
            user.lastName = 'TT2';
            user.role = UserRole.ADMIN;
            
            await getRepository(User).save(user);
            
            return request(application.appContext)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: any) => {
                    assert.deepEqual(response.body, [UserDtoConverter.toDto(user)]);
                })
        });
    });
});

