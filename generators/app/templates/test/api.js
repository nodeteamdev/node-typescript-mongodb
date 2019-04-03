const chai = require('chai');
const request = require('supertest');
const app = require('../src/config/server/server').default;
const UserModel = require('../src/components/User/model').default;
<%_ if(authentication === 'oauth2.0') { _%>
const ClientModel = require('../src/config/oauth/clientModel').default;
const TokenModel = require('../src/config/oauth/tokenModel').default;
const AuthCodeModel = require('../src/config/oauth/authCodeModel').default;
<%_ }_%>
chai.should();

/**
 * API tests
 */
describe('API', () => {
    it('get all users', (done) => {
        request(app)
            .get('/v1/users')
            <%_ if(authentication === 'oauth2.0') { _%>
            .set('Authorization', `Bearer ${global.accessToken}`)
            <%_ }_%>
            <%_ if(authentication === 'passport-local-strategy') { _%>
            .set('Cookie', global.cookie)
            <%_ }_%>
            <%_ if(authentication === 'jwt-auth') { _%>
            .set('x-access-token', global.token)
            <%_ }_%>
            .expect((res) => {
                res.status.should.equal(200);
                res.body.should.be.an('array');
            })
            .end(done);
    });

    it('create new user', (done) => {
        const newUser = {
            email: 'new.user@gmail.com',
            name: 'John Doe'
        };

        request(app)
            .post('/v1/users')
            .send(newUser)
            <%_ if(authentication === 'oauth2.0') { _%>
            .set('Authorization', `Bearer ${global.accessToken}`)
            <%_ }_%>
            <%_ if(authentication === 'passport-local-strategy') { _%>
            .set('Cookie', global.cookie)
            <%_ }_%>
            <%_ if(authentication === 'jwt-auth') { _%>
            .set('x-access-token', global.token)
            <%_ }_%>
            .expect((res) => {
                res.status.should.equal(201);
                res.body.should.have.property('email');
            })
            .end(done);
    });
});

/**
 * clear database after tests
 */
after(async () => {
    try {
        <%_ if(authentication === 'oauth2.0') { _%>
        
        await AuthCodeModel.collection.drop();
        await TokenModel.collection.drop();
        await ClientModel.collection.drop();
        <%_ }_%>
        await UserModel.collection.drop();
    } catch (error) {
        console.log('Something went wrong after tests, seems your database doesnt cleaned');
    }
});
