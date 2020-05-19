require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../src/config');
const AuthService = require('../services/service.client-auth');

// Auth Notes //
// This is the first stage of authentication for the app.  When connecting the client
// will provide an API
function requireAPIKey(req, res, next) {
    const api_key = req.query.api_key || ''
    const authToken = AuthService.createJwt(api_key, {"user_hash": bcrypt.hashSync(api_key, 8)})
    const payload = AuthService.verifyJwt(authToken);
    try {
      if (AuthService.compare(payload.sub, process.env.API_CLIENT_HASH) === false) {
        res.status(401).json({ error: 'Invalid API key provided' })
      }
      next();
    } catch(error) {
      res.status(401).json({ error: 'Invalid API key provided' })
    }
  }
  
  module.exports = {
    requireAPIKey,
  }