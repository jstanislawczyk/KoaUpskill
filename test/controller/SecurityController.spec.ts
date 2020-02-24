import {assert} from 'chai';
import {getRepository} from 'typeorm';
import {Application} from '../../src/config/Application';
import {Logger} from '../../src/config/Logger';
import {LoggerLevel} from '../../src/enum/LoggerLevel';
import * as request from 'supertest';
import {Error} from '../../src/exception/Error';
import {ErrorDataGenerator} from '../util/data-generator/ErrorDataGenerator';
import {User} from '../../src/entity/User';
import {UserAuthenticationDto} from '../../src/dto/UserAuthenticationDto';
import {UserAuthenticationDataGenerator} from '../util/data-generator/UserAuthenticationDataGenerator';
import {UserDataGenerator} from '../util/data-generator/UserDataGenerator';
import {UserRole} from '../../src/enum/UserRole';
import {PasswordHashingUtils} from '../../src/security/PasswordHashingUtils';
import {JsonWebToken} from '../../src/config/helper/JsonWebToken';
import {verify} from 'jsonwebtoken';
import * as config from 'config';

const application: Application = new Application();

describe('Security controller integration test', () => {

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

    describe('POST /security/login BAD REQUEST', () => {
        it('respond with bad request (no request body)', async () => {
            return request(application.appContext)
                .post('/api/security/login')
                .set('Accept', 'application/json')
                .expect(400);
        });
    });

    describe('POST /security/login UNAUTHORIZED', () => {
        it('respond with login failed (wrong data)', async () => {
            let user: User = UserDataGenerator.createUser('test@mail.com', 'SomePassword111@', 'John', 'Doe', UserRole.MANAGER);
            user = await getRepository(User).save(user);

            const userAuthentication: UserAuthenticationDto =
                UserAuthenticationDataGenerator.createUserAuthentication('test@mail.com', '1qazXSW@');

            return await request(application.appContext)
                .post('/api/security/login')
                .set({
                    'Accept': 'application/json',
                })
                .send(userAuthentication)
                .expect(401)
                .then((response: any) => {
                    const errorResponse: Error = JSON.parse(response.text);
                    const expectedErrorResponse = ErrorDataGenerator.createError(401, 'Login failed');

                    assert.deepEqual(errorResponse, expectedErrorResponse);
                });
        });
    });

    describe('POST /security/login OK', () => {
        it('respond with user authentication token', async () => {
            let user: User = UserDataGenerator.createUser(
                'some@mail.com', await PasswordHashingUtils.hashPassword('1qazXSW@'), 'John', 'Doe', UserRole.MANAGER);
            user = await getRepository(User).save(user);

            const userAuthenticationDto: UserAuthenticationDto =
                UserAuthenticationDataGenerator.createUserAuthentication('some@mail.com', '1qazXSW@');

            return await request(application.appContext)
                .post('/api/security/login')
                .set({
                    'Accept': 'application/json',
                })
                .send(userAuthenticationDto)
                .expect(200)
                .then((response: any) => {
                    const applicationSecret: string = config.get('security.secret');
                    const appName: string = config.get('app.name');
                    const tokenBody: JsonWebToken = verify(response.text, applicationSecret) as JsonWebToken;

                    assert.isNotNull(response.text);
                    assert.equal(tokenBody.sub, user.id.toHexString());
                    assert.equal(tokenBody.iss, appName);
                    assert.equal(tokenBody.exp, tokenBody.iat + 86400);
                });
        });
    });
});
