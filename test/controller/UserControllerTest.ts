import { User } from '../../src/entity/User';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha'; 
import 'reflect-metadata';

const serverAddress = 'http://localhost:3000';
const usersRequestPath = '/api/users';
const { expect } = chai;

chai.use(chaiHttp);

describe('Users', () => {
    it('Saves users', function(done) {
        const newUserForTest = {
            name: 'TEST_USER',
            age: 22,
        };

        chai.request(serverAddress)
            .post(usersRequestPath)
            .set('content-type', 'application/json')
            .send(newUserForTest)
            .end((err: any, res: any) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('Returns all users', function(done) {
        const newUserForTest = {
            name: 'TEST_USER',
            age: 22,
        };

        chai.request(serverAddress)
            .get(usersRequestPath)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body)
                    .to.be.an.instanceof(Array)
                    .and.to.have.property('0')
                    .that.includes.all.keys([ 'id', 'name', 'age' ])
                    .to.include(newUserForTest);

                done();
            });
    });
})