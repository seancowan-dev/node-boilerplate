const knex = require('knex');
const app = require('../src/app');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
dotenv.config();
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

    describe(`| POST /api/users/add | Test Object |`, () => { // Test the add users endpoint
        const serial = user => ({
            id: xss(user.id),
            name: xss(user.name),
            password: xss(user.password),
            email: xss(user.email),
            created_at: xss(user.created_at),
            modified_at: xss(user.updated_at),
            perm_level: xss(user.perm_level)
        });

        context(`| Invalid api_key provided |`, () => { // If there is an invalid api key
            const expected_res = { error: 'Invalid API key provided' }; // Expected response
            it(`| Responds: 401 | Returns: 'Invalid API key provided' |`, () => { // Attempt to add user with invalid API key
                return supertest(app)
                .post(`/api/users/add?api_key=${invalid_key}`)  // Add a user using an invalid API key
                .send(test_users.dbUsers[0])
                .expect(401, expected_res); // Expect the api to return an error saying access is denied
            });
        });

        context(`| Valid api_key provided |`, () => { // If there is a valid api key
            it(`| Responds: 201 | Returns: Serialized User Object |`, () => { // Adding a new user should return a complete user object
                return supertest(app)
                .post(`/api/users/add?api_key=${valid_key}`) // Attempt to add a new user
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
                });
            });
        });
    });

    describe(`| POST /api/users/login | Test Object |`, () => {
        context(`| User Has Invalid Credentials |`, () => {
            beforeEach('Insert test user accounts', () => {
                return db.into('registered_users').insert(test_users.dbUsers);
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
                            expect(res.body.error).to.eql(expected);
                        });
                });
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
                            expect(res.body.error).to.eql(expected);
                        });
                });
            });
        });      
    });
    
    describe(`| GET /api/users/getAllUsers | Test Object |`, () => {
        context(`| User Is Admin |`, () => {
            beforeEach('Insert test user accounts', () => {
                return db.into('registered_users').insert(test_users.dbUsers);
            });
            it(`| Responds: 201 | Returns: An array of user objects`, () => {
                const { name, password } = test_users.validLogins[3]
                const test_login = {
                    name: name,
                    password: password
                };
    
                return supertest(app)
                    .post(`/api/users/login?api_key=${valid_key}`)
                    .send(test_login)
                    .expect(201)
                    .expect(res => {
                        let token = res.body.authToken;
                        return supertest(app)
                            .get(`/api/users/getAllUsers?api_key=${valid_key}`)
                            .set('Authorization', `Bearer ${token}`)
                            .expect(200)
                            .expect(res => {
                                expect(res.body).to.eql(test_user.dbUsers);
                            });
                    });
            });
        });
    });

    describe(`| GET /api/users/info/:id | Test Object |`, () => { // Test the single users endpoint
        context('| User Is Self |', () => {
            beforeEach('Insert test user accounts', () => { // Insert test accounts
                return db.into('registered_users').insert(test_users.dbUsers);
            });

            const { name, password } = test_users.validLogins[2] // Use test account 3
            const test_login = {
                name: name,
                password: password
            };
            it(`| Responds: 201 | Returns: A matching user object`, () => { 
                return supertest(app)
                .post(`/api/users/login?api_key=${valid_key}`) // Log the user in
                .send(test_login)
                .expect(201)
                .expect(res => {
                    let token = res.body.authToken;
                    return supertest(app)
                        .get(`/api/users/getAllUsers?api_key=${valid_key}`) // Since the db generates user ids, get all the users
                        .set('Authorization', `Bearer ${token}`)
                        .expect(200)
                        .expect(res => {
                            let user = res.body.find(user => { // Find the user matching test account 3
                                if (user.name === test_login.name) {
                                    return user;
                                }
                            });
                            
                            return supertest(app)
                            .get(`/api/users/info/${user.id}`) // Perform the single user search
                            .set('Authorization', `Bearer ${token}`)
                            .expect(200)
                            .expect(res => {
                                expect(res.body.id).to.eql(user.id);  // If input id matches the output id endpoint is working as intended
                            });
                        });
                });
            });
                
        });
    });

    describe(`| DELETE /api/users/delete/:id | Test Object |`, () => {  // Test the delete users endpoint
        context(`| User is Admin |`, () => { // only Admins may delete users
            beforeEach('Insert test user accounts', () => { // Insert test accounts
                return db.into('registered_users').insert(test_users.dbUsers);
            });

            const { name, password } = test_users.validLogins[2] // Use test account 3
            const test_login = {
                name: name,
                password: password
            };
            it(`| Responds: 201 | Deletes user`, () => {
                return supertest(app)
                .post(`/api/users/login?api_key=${valid_key}`) // Log the user in 
                .send(test_login)
                .expect(201)
                .expect(res => {
                    let token = res.body.authToken;
                    return supertest(app)
                        .get(`/api/users/getAllUsers?api_key=${valid_key}`) // Since the db generates user ids, get all the users
                        .set('Authorization', `Bearer ${token}`)
                        .expect(200)
                        .expect(res => {
                            let user = res.body.find(user => { // Find the user matching test account 3
                                if (user.name === test_login.name) {
                                    return user;
                                }
                            });
                            
                            return supertest(app)
                            .delete(`/api/users/delete/${res.body.user.id}?api_key=${valid_key}`) // Attempt to delete the specified user
                            .set('Authorization', `Bearer ${token}`)
                            .expect(204);
                    });
                });
            });
        }); 
    });
});