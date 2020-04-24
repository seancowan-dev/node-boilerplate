require('dotenv').config();
const bcrypt = require('bcryptjs')
const bsync = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../src/config')

const ClientAuthService = {
  compare(input, hash) {
    return bsync.compareSync(input, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, process.env.API_CLIENT_SECRET, {
      subject,
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

module.exports = ClientAuthService