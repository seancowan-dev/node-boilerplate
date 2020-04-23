const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('../services/service.users.js');

const usersRouter = express.Router()
const bodyParser = express.json()

const serial = user => ({
    id: xss(user.id),
    name: xss(user.name),
    password: xss(user.password),
    email: xss(user.email),
    created_at: xss(user.created_at),
    modified_at: xss(user.updated_at)
})

usersRouter
    .route('/info')
    .get((req, res, next) => { // Get list of users
        const knex = req.app.get('db')
        UsersService.getAllUsers(knex)
        .then(users => {
            res.json(users.map(serial))  // Return a serialized map of users for the client to parse when needed
        })
        .catch(next)
    });

usersRouter
    .route('/add')
    .post(bodyParser, (req, res, next) => {  // Add a new user
        const { name, password, email, created_at } = req.body;
        const newUser = { name, password, email, created_at }

        for (const [key, value] of Object.entries(newUser))  // Make sure all info is provided
            if (value === null) 
            return res.status(400).json({
                error: {message: `Missing '${key}' in request body.  Valid posts must contain, id, name, modified, and folderID`}
            })

        UsersService.addUser(  // Insert the information
            req.app.get('db'),
            newUser
        )
        .then(user => {  
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(serial(user))
        })
        .catch(next)
    });

usersRouter
    .route('/info/:id')  // Find user information by ID
    .get((req, res, next) => {
        UsersService.getUserById(
            req.app.get('db'),
            req.params.id
        )
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: { message: `Could not find user with id: ${req.params.id}` }
                })
            }
            res.status(200).json(serial(user));
        })
        .catch(next);
    });
usersRouter
    .route('/delete/:id')
    .all((req, res, next) => {
        UsersService.getUserById(
            req.app.get('db'),
            req.params.id
        )
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: { message: `Could not find user with id: ${req.params.id}` }
                })
            }
            res.user = user;
            next();          
        })
    })
    .delete((req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.params.id
        )
        .then(rows => {
            res.status(204).end()
        })
        .catch(next);
    });

usersRouter
    .route('/update/:id')
    .all((req, res, next) => {
        UsersService.getUserById(
            req.app.get('db'),
            req.params.id
        )
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: { message: `Could not find user with id: ${req.params.id}` }
                })
            }
            res.user = user;
            next();          
        })
    })    
    .patch(bodyParser, (req, res, next) => {
        const { name, password, email } = req.body;
        const updateUser = { name, password, email };

        const numOfVals = Object.values(updateUser).filter(Boolean).length;  // Make sure request had all info
        if(numOfVals === 0) {
            return res.status(400).json({
                error: {
                    message: `Missing user credentials, all user info should be passed to api.`
                }
            })
        }
        UsersService.updateUser(
            req.app.get('db'),
            req.params.id,
            updateUser
        )
        .then(rows => {
            res.json(res.user);
            res.status(204).end()
        })
        .catch(next)
    });

    module.exports = usersRouter