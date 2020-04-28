const knex = require('knex');
const app = require('../src/app');
const dotenv = require('dotenv');
dotenv.config();
const UsersService = require('../services/service.users');
const { makeTestUsers } = require('./users.fixtures');

describe('|Users Routes Test Object|', function() {
    let db;
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

    describe(`| POST /api/users/add | Test Object|`, () => {
        const testUsers = makeTestUsers();
        const valid_key = "f36d54c6-47c9-43de-aa5a-835ae17bdaba";
        const invalid_key = "f36d54c6-47c9-43de-aa5a-835ae17bdabadaddfadfdsf";

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
            it(`| Responds: 401 | 'Invalid API key provided' |`, () => {
                return supertest(app)
                .post(`/api/users/add?api_key=${invalid_key}`)
                .send(testUsers.dbUsers[0])
                .expect(401, expected_res)
            })
        });

        context(`| Valid api_key provided |`, () => {
            const expected_date = "Wed Jan 22 2020 21:10:25 GMT-0500 (Eastern Standard Time)";
            it(`| Responds: 201 | With Serialized User Object |`, () => {
                return supertest(app)
                .post(`/api/users/add?api_key=${valid_key}`)
                .send(testUsers.dbUsers[0])
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(testUsers.dbUsers[0].name);
                    expect(res.body.email).to.eql(testUsers.dbUsers[0].email);
                    expect(res.body.password).to.eql(testUsers.dbUsers[0].password);
                    expect(res.body.created_at).to.eql(expected_date);
                    expect(res.body.perm_level).to.eql(testUsers.dbUsers[0].perm_level);
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('updated_at');
                })
            })
        });
    });
    // describe(`| GET /api/users/login | Test Object|`, () => {

    //     context(`| User Has Valid Credentials`, () => {
    //         it(`Responds with `)
    //     });
    // });
});