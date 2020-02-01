import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../src/app';

process.env.NODE_ENV = 'test';

let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    /*
    beforeEach((done) => {
        Book.remove({}, (err) => { 
           done();           
        });        
    });
    */

    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(app)
                .get('/users')
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});