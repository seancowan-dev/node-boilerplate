const express = require('express')
const LoginAuthService = require('../services/services.login-auth');

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { name, password } = req.body
    const loginUser = { name, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    LoginAuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect name or password',
          })

        return LoginAuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect name or password',
              })

            const sub = dbUser.name
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: LoginAuthService.createJwt(sub, payload),
            })
          })
      })
      .catch(next)
  })

module.exports = authRouter