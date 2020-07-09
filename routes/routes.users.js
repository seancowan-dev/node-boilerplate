const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('../services/service.users.js');
const LoginAuthService = require('../services/services.login-auth');
const { requireAPIKey } = require('../middleware/auth');
const { requireAuth } = require('../middleware/loginAuth');
const usersRouter = express.Router()
const bodyParser = express.json()

const serial = user => ({
    id: xss(user.id),
    name: xss(user.name),
    password: xss(user.password),
    email: xss(user.email),
    created_at: xss(user.created_at),
    updated_at: xss(user.updated_at),
    perm_level: xss(user.perm_level)
})

usersRouter
    .route('/add')
    .all(requireAPIKey)
    .post(bodyParser, (req, res, next) => {  // Add a new user
        const perm_level = "user";
        const { name, password, email, created_at } = req.body;
        const newUser = { name, password, email, created_at, perm_level };

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
    .route('/getAllUsers') // Get all users for admins
    .all(requireAPIKey)
    .all(requireAuth)
    .get((req, res, next) => {
        UsersService.getAll(req.app.get('db'), req.user.id).then(users => {
            if (req.user.perm_level !== "admin") {
                return res.status(400).json({
                    error: { message: 'You must be an admin to access this endpoint.'}
                })
            }
            res.status(200).json(users.map(serial));
        }).catch(next);
    });

usersRouter
    .route('/info/:id')  // Find user information by ID
    .all(requireAPIKey)
    .all(requireAuth)
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
            if ((user.perm_level !== "admin" && user.id !== req.params.id) === true) {
                return res.status(404).json({
                    error: { message: `You must either be an admin or the owner of this account to view info about it.` }
                })               
            }
            res.status(200).json(serial(user));
        })
        .catch(next);
    });
usersRouter
    .route('/delete/:id')
    .all(requireAPIKey)
    .all(requireAuth)
    .all((req, res, next) => {
        if (req.user.perm_level !== "admin") {
            return res.status(404).json({
                error: { message: `You must be an admin in order to delete users. Your level is '${req.user.perm_level}'`}
            })
        }
        if (req.user.id === req.params.id) {
            return res.status(404).json({
                error: { message: `You cannot delete your own account!`}
            })
        }
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
    .all(requireAPIKey)
    .all(requireAuth)
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
        if (req.user.perm_level === "admin" || updateUser.name === req.user.name) {
            const numOfVals = Object.values(updateUser).filter(Boolean).length;  // Make sure request has all info
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
                res.status(204).json({
                    message: "Successfully updated password"
                })
            })
            .catch(next);
        } else {
            return res.status(400).json({
                error: {
                    message: `You must either be the owner of this account or an admin to change its settings.`
                }
            })            
        }

    });

usersRouter
.all(requireAPIKey)
.post('/login', bodyParser, (req, res, next) => {
    const { name, password } = req.body
    const loginUser = { name, password }

    
    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(401).json({
          error: `Missing '${key}' in request body`
        })

    LoginAuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(401).json({
            error: 'Incorrect user name has been entered.',
          })

        return LoginAuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(401).json({
                error: 'Incorrect password has been entered.',
              })

            const sub = dbUser.name
            const payload = { user_id: dbUser.id }
            res.status(201).json({
              authToken: LoginAuthService.createJwt(sub, payload),
            })
          })
      })
      .catch(next)
    });

    usersRouter
    .route('/refresh')
    .all(requireAPIKey)
    .all(requireAuth)
    .post((req, res) => {
        const sub = req.user.name
        const payload = { user_id: req.user.id }
        res.send({
          authToken: LoginAuthService.createJwt(sub, payload),
        })
    });

    module.exports = usersRouter