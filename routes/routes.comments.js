const path = require('path');
const express = require('express');
const xss = require('xss');
const { requireAPIKey } = require('../middleware/auth');
const { requireAuth } = require('../middleware/loginAuth');
const myRouter = express.Router()
const bodyParser = express.json()

myRouter
    .route('/get/:id') // Get single comments by comment ID
    .all(requireAPIKey)
    .get((req, res, next) => {
        // do stuff here
    });

module.exports = myRouter;