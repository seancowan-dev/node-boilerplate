const knex = require('knex');
const app = require('../src/app');
const dotenv = require('dotenv');
dotenv.config();
const UsersService = require('../services/service.users');
const AuthService = require('../services/services.login-auth');
const { makeTestUsers } = require('./users.fixtures');

describe('|Users Routes Test Object|', function() {
    // Prepare Necessary Constants and Variables //
    let db;
    const test_users = makeTestUsers();
    const valid_key = "f36d54c6-47c9-43de-aa5a-835ae17bdaba";
    const invalid_key = "f36d54c6-47c9-43de-aa5a-835ae17bdabadaddfadfdsf";
    const expected_date = "Wed Jan 22 2020 21:10:25 GMT-0500 (Eastern Standard Time)";

    // Instantiate Knex Object //
    before('make knex instance', () => {
        db = knex(
            {
                client: "pg",
                connection: process.env.TEST_DATABASE_URL,
            }
        );
        app.set('db', db);
    })

    // Disconnect and Clean //
    after('disconnect from db', () => db.destroy());
    before('clean table', ()=> db.raw('TRUNCATE registered_users RESTART IDENTITY CASCADE'));
    afterEach('clean table after each test', ()=> db.raw('TRUNCATE registered_users RESTART IDENTITY CASCADE'));

    // Begin Assertions //

    describe(`| POST /api/users/add | Test Object |`, () => {

        const serial = user => ({
            id: xss(user.id),
            name: xss(user.name),
            password: xss(user.password),
            email: xss(user.email),
            created_at: xss(user.created_at),
            modified_at: xss(user.updated_at),
            perm_level: xss(user.perm_level)
        });

        context(`| Invalid api_key provided |`, () => {
            const expected_res = { error: 'Invalid API key provided' };
            it(`| Responds: 401 | Returns: 'Invalid API key provided' |`, () => {
                return supertest(app)
                .post(`/api/users/add?api_key=${invalid_key}`)
                .send(test_users.dbUsers[0])
                .expect(401, expected_res)
            })
        });

        context(`| Valid api_key provided |`, () => {

            it(`| Responds: 201 | Returns: Serialized User Object |`, () => {
                return supertest(app)
                .post(`/api/users/add?api_key=${valid_key}`)
                .send(test_users.dbUsers[0])
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(test_users.dbUsers[0].name);
                    expect(res.body.email).to.eql(test_users.dbUsers[0].email);
                    expect(res.body.password).to.eql(test_users.dbUsers[0].password);
                    expect(res.body.created_at).to.eql(expected_date);
                    expect(res.body.perm_level).to.eql(test_users.dbUsers[0].perm_level);
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('updated_at');
                })
            })
        });
    });

    describe(`| GET /api/users/login | Test Object |`, () => {

        context(`| User Has Valid Credentials |`, () => {
            
            beforeEach('Insert test user accounts', () => {
                return db.into('registered_users').insert(test_users.dbUsers[0]);
            });

            const { name, password } = test_users.validLogins[0]
            const test_login = {
                name: name,
                password: password
            }

            it(`| Responds: 201 | Returns: Valid JWT |`, () => {
                    return supertest(app)
                    .post(`/api/users/login?api_key=${valid_key}`)
                    .send(test_login)
                    .expect(201)
                    .expect(res => {
                            expect(AuthService.verifyJwt(res.body.authToken))
                    })
            })
        });

        context(`| User Has Invalid Credentials |`, () => {

            beforeEach('Insert test user accounts', () => {
                return db.into('registered_users').insert(test_users.dbUsers[0]);
            });


            context(`| Bad Password Supplied by User |`, () => {

                it(`| Responds: 401 | Returns: 'Incorrect password has been entered.'`, () => {
                    const expected = "Incorrect password has been entered.";

                    const { name, password } = test_users.invalidPasswords[0]
    
                    const bad_password = {
                        name: name,
                        password: password
                    }
    
                        return supertest(app)
                        .post(`/api/users/login?api_key=${valid_key}`)
                        .send(bad_password)
                        .expect(401)
                        .expect(res => {
                            expect(res.body.error).to.eql(expected)
                        })
                })
            });

            context(`| Bad Username Supplied by User |`, () => {
                it(`| Responds: 401 | Returns: 'Incorrect user name has been entered.'`, () => {
                    const expected = "Incorrect user name has been entered.";

                    const { name, password } = test_users.invalidUsernames[0]
    
                    const bad_username = {
                        name: name,
                        password: password
                    }
    
                        return supertest(app)
                        .post(`/api/users/login?api_key=${valid_key}`)
                        .send(bad_username)
                        .expect(401)
                        .expect(res => {
                            expect(res.body.error).to.eql(expected)
                        })
                })
            });
        });      
    });  
});