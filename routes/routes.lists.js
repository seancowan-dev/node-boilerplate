const path = require('path');
const express = require('express');
const xss = require('xss');
const ListsService = require('../services/service.lists');
const { requireAPIKey } = require('../middleware/auth');
const { requireAuth } = require('../middleware/loginAuth');
const listsRouter = express.Router()
const bodyParser = express.json()

const serialList = list => ({
    id: xss(list.id),
    user_id: xss(list.user_id),
    list_name: xss(list.list_name)
});

const serialItem = item => ({
    id: xss(item.id),
    title: xss(item.title),
    date_added: xss(item.date_added),
    list_id: xss(item.list_id)
});

const serialJoin = join => ({
    id: xss(join.id),
    user_id: xss(join.user_id),
    list_name: xss(join.list_name),
    id: xss(join.id),
    title: xss(join.title),
    date_added: xss(join.date_added),
    list_id: xss(join.list_id)
});

listsRouter
    .route('/get')
    .all(requireAPIKey)
    .all(requireAuth)
    .get((req, res, next) => { // Get list of users
        const knex = req.app.get('db')
        if (req.user.perm_level !== "admin") {
            return res.status(404).json({
                error: { message: "You must be an admin in order to view all lists" }
            })
        }
        ListsService.getAllLists(knex)
        .then(lists => {
            res.json(lists.map(serialJoin))  // Return a serialized map of users for the client to parse when needed
        })
        .catch(next)
    });

    module.exports = listsRouter