const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../src/config');

const LoginAuthService = {
  getUserWithUserName(db, name) {
    return db('registered_users')
      .where({ name })
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, process.env.API_CLIENT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },
  verifyJwt(token) {
    return jwt.verify(token, process.env.API_CLIENT_SECRET, {
      algorithms: ['HS256'],
    })
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },
}

module.exports = LoginAuthService