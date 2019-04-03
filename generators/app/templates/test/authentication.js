const chai = require('chai');
const request = require('supertest');
const app = require('../src/config/server/server').default;
const user = require('./fixtures/user.json');
<%_ if(authentication === 'oauth2.0') { _%>
const q = require('querystring');
const ClientModel = require('../src/config/oauth/clientModel').default;
const TokenModel = require('../src/config/oauth/tokenModel').default;
const OAuthClient = require('./fixtures/OAuthClient.json');
const OAuthToken = require('./fixtures/OAuthToken');
const UserModel = require('../src/components/User/model').default;
<%_ }_%>
chai.should();

/**
 * storing globals to access them in API requests
 */
<%_ if(authentication === 'jwt-auth') { _%>
global.token = '';
<%_ }_%>
<%_ if(authentication === 'passport-local-strategy') { _%>
global.cookie = '';
<%_ }_%>  
<%_ if(authentication === 'oauth2.0') { _%>
global.code = '';
global.accessToken = '';

/**
 * Creating default client
 */
before(async () => {
    try {
        await ClientModel.findOneAndUpdate({
                id: OAuthClient.id
            },
            OAuthClient, {
                upsert: true,
                new: true
            }
        );

    } catch (error) {
        throw new Error(error);
    }
});
<%_ }_%>  
/**
 * Authentication tests
 */
describe('Authentication', () => {
    <%_ if(authentication === 'oauth2.0') { _%>
    it('sign up', () => {
        return request(app)
            .post('/auth/signup')
            .send(user)
            .expect('Content-type', /json/)
            .then(async (res) => {
                res.body.status.should.equal(200);
                res.body.user.should.have.property('email');

                const user = await UserModel.findOne({
                    email: res.body.user.email
                });

                OAuthToken.user = user._id.toString();

                await TokenModel.findOneAndUpdate({
                        user: OAuthToken.user
                    },
                    OAuthToken, {
                        upsert: true
                    }
                );

            });
    });
    <%_ }_%>
    <%_ if(authentication === 'passport-local-strategy' || authentication === 'jwt-auth') { _%>
    it('sign up', (done) => {
        request(app)
            .post('/auth/signup')
            .send(user)
            .expect('Content-type', /json/)
            .expect((res) => {
                res.body.status.should.equal(200);
                res.body.logged.should.equal(true);
                res.body.message.should.be.a('string');
                <%_ if(authentication === 'passport-local-strategy') { _%>
                global.cookie = res.header['set-cookie'];
                <%_ }_%>
                <%_ if(authentication === 'jwt-auth') { _%>
                global.token = res.body.token;
                <%_ }_%>
            })
            .end(done)
    });
    <%_ }_%>
    it('sign up user with existing email', (done) => {
        request(app)
            .post('/auth/signup')
            .send(user)
            .expect('Content-type', /json/)
            .expect((res) => {
                res.body.status.should.equal(400);
            })
            .end(done);
    });
    <%_ if(authentication === 'oauth2.0') { _%>
    it('login to app, redirects to your redirectUri with code', (done) => {
        request(app)
            .post('/auth/login?' +
                `client_id=${OAuthClient.id}&` +
                'state=randomstring&' +
                'response_type=code'
            )
            .send(user)
            .expect((res) => {
                res.status.should.equal(302);
                global.code = q.parse(res.header['location'].split('?')[1]).code;
            })
            .end(done);
    });
    <%_ }_%>
    <%_ if(authentication === 'passport-local-strategy' || authentication === 'jwt-auth') { _%>
    it('login to app', (done) => {
        request(app)
            .post('/auth/login')
            .send(user)
            .expect('Content-type', /json/)
            .expect((res) => {
                res.body.status.should.equal(200);
                res.body.logged.should.equal(true);
                res.body.message.should.be.a('string');
                <%_ if(authentication === 'passport-local-strategy') { _%>
                global.cookie = res.header['set-cookie'];
                <%_ }_%>
                <%_ if(authentication === 'jwt-auth') { _%>
                global.token = res.body.token;
                <%_ }_%>
            })
            .end(done);
    });
    <%_ }_%>
    <%_ if(authentication === 'oauth2.0') { _%>
    it('getting tokens', (done) => {
        const data = {
            code: global.code,
            client_id: OAuthClient.id,
            client_secret: OAuthClient.secret,
            grant_type: 'authorization_code'
        };

        request(app)
            .post(`/auth/token?redirect_uri=${OAuthClient.redirectUris[0]}`)
            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .send(data)
            .expect((res) => {
                res.status.should.equal(200);
                res.body.should.have.property('accessToken');
                res.body.should.have.property('refreshToken');
                global.accessToken = res.body.accessToken;
            })
            .end(done);
    });
    <%_ }_%>
});