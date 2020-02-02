import { expect } from 'chai';
import { User } from '../../src/entity/User';
import request = require('request');
import 'mocha'; 
import 'reflect-metadata';

describe('Users', () => {
    it('Main page content', function(done) {
        request('http://localhost:8080/api/users' , function(error: any, response: any, body: any) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
})