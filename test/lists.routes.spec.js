const knex = require('knex');
const app = require('../src/app');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
dotenv.config();
const { makeTestLists } = require('./lists.fixtures');
const { makeTestUsers } = require('./users.fixtures');
const { expect } = require('chai');

describe('|Lists Routes Test Object|', function() {
    // Prepare Necessary Constants and Variables //
    let db;
    const test_lists = makeTestLists();
    const test_users = makeTestUsers();
    const valid_key = "f36d54c6-47c9-43de-aa5a-835ae17bdaba";

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
    before('clean table', ()=> db.raw('TRUNCATE user_lists RESTART IDENTITY CASCADE'));
    before('clean table', ()=> db.raw('TRUNCATE list_items RESTART IDENTITY CASCADE'));
    before('clean table', ()=> db.raw('TRUNCATE registered_users RESTART IDENTITY CASCADE'));
    afterEach('clean table after each test', ()=> db.raw('TRUNCATE registered_users RESTART IDENTITY CASCADE'));
    afterEach('clean table after each test', ()=> db.raw('TRUNCATE user_lists RESTART IDENTITY CASCADE'));
    afterEach('clean table after each test', ()=> db.raw('TRUNCATE list_items RESTART IDENTITY CASCADE'));

    // Begin Assertions //
    describe(`| POST /api/lists/add | /api/lists/addItem | Test Object |`, () => { // Test the add users endpoint
        context('| Add new list |', () => {
            before('Insert test user accounts', () => { // Insert test accounts
                return db.into('registered_users').insert(test_users.dbUsers);
            });

            const { name, password } = test_users.validLogins[2] // Use test account 3
            const test_login = {
                name: name,
                password: password
            };
            let token;
            step(`| Responds: 201 | Login as some user that is not the owner of the list`, () => { 
                return supertest(app)
                .post(`/api/users/login?api_key=${valid_key}`) // Log the user in
                .send(test_login)
                .expect(201)
                .expect(res => {
                    token = res.body.authToken;
                    
                    expect(res.body).to.have.property("authToken");
                });
            });
            
            step(`| Responds: 401 | Only account owners can add lists`, () => { // Attempt to add a new user list
                return supertest(app)
                .post(`/api/lists/add?api_key=${valid_key}`) // Log the user in
                .set({"Authorization": `Bearer ${token}`})
                .send(test_lists.testLists[0])
                .expect(401);
            });    
        });
        context('| Add new list item |', () => {
            before('Insert test user accounts', () => { // Insert test accounts
                return db.into('registered_users').insert(test_users.dbUsers);
            });

            const { name, password } = test_users.validLogins[2] // Use test account 3
            const test_login = {
                name: name,
                password: password
            };
            let token;
            step(`| Responds: 201 | Login as some user that is not the owner of the list`, () => { 
                return supertest(app)
                .post(`/api/users/login?api_key=${valid_key}`) // Log the user in
                .send(test_login)
                .expect(201)
                .expect(res => {
                    token = res.body.authToken;
                    
                    expect(res.body).to.have.property("authToken");
                });
            });
            
            step(`| Responds: 401 | Only account owners can add list items`, () => { // Attempt to add a new user list
                return supertest(app)
                .post(`/api/lists/addItem?api_key=${valid_key}`) // Log the user in
                .set({"Authorization": `Bearer ${token}`})
                .send(test_lists.testItems[0])
                .expect(401);
            });    
        });
    });
    describe(`| GET /api/lists/get | Test Object |`, () => { // Test the add users endpoint
        context('| Get all list |', () => {
            before('Insert test user accounts', () => { // Insert test accounts
                return db.into('registered_users').insert(test_users.dbUsers);
            });

            const { name, password } = test_users.validLogins[2] // Use test account 3
            const test_login = {
                name: name,
                password: password
            };
            let token;
            step(`| Responds: 201 | Login as some user that is not an admin`, () => { 
                return supertest(app)
                .post(`/api/users/login?api_key=${valid_key}`) // Log the user in
                .send(test_login)
                .expect(201)
                .expect(res => {
                    token = res.body.authToken;
                    expect(res.body).to.have.property("authToken");
                });
            });

            step(`| Responds: 401 | Only admins owners can view all list items`, () => { // Attempt to add a new user list
                return supertest(app)
                .get(`/api/lists/get?api_key=${valid_key}`) // Log the user in
                .set({"Authorization": `Bearer ${token}`})
                .expect(401);
            });    
        });
    });
});