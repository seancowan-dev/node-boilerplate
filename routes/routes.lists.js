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
        if (req.user.perm_level !== "admin") {
            return res.status(404).json({
                error: { message: "You must be an admin in order to view all lists" }
            })
        }
        ListsService.getAllLists(req.app.get('db'))
        .then(lists => {
            res.json(lists.map(serialJoin))  // Return a serialized map of users for the client to parse when needed
        })
        .catch(next)
    });

listsRouter
    .route('/getList/:id')
    .all(requireAPIKey)
    .all(requireAuth)
    .get((req, res, next)=> {
        if (req.user.perm_level === "admin" || req.params.id === req.user.id) {
            ListsService.getUserListsById(req.app.get('db'), req.params.id)
            .then(list => {
                res.json(list.map(serialJoin))
            })
            .catch(next)
        } else {
            return res.status(400).json({
                error: {
                    message: `You must either be the owner of this account or an admin to view its lists.`
                }
            })            
        }
    });

listsRouter
.route('/add')
    .all(requireAPIKey)
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {  // Add a new user
        const { list_name, user_id } = req.body;
        const newList = { list_name, user_id };

        if (newList.user_id !== req.user.id) {
            return res.status(400).json({
                error: {
                    message: `You must be the owner of this account to add lists to it.`
                }
            })                  
        }

        for (const [key, value] of Object.entries(newList))  // Make sure all info is provided
            if (value === null) 
            return res.status(400).json({
                error: {message: `Missing '${key}' in request body.  Valid posts must contain, id, name, modified, and folderID`}
            })

        ListsService.addList(  // Insert the information
            req.app.get('db'),
            newList
        )
        .then(list => {  
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${list.id}`))
            .json(serialList(list))
        })
        .catch(next)
    });

    listsRouter
    .route('/addItem')
        .all(requireAPIKey)
        .all(requireAuth)
        .post(bodyParser, (req, res, next) => {  // Add a new user
            const user_id = req.user.id;
            ListsService.getUserListsById(req.app.get('db'), user_id)
            .then(list => {
                const list_items = list.map(serialList(list));

                for (const [key, value] of Object.entries(list_items)) {
                    if (key === "user_id") {
                        if (value !== user_id) {
                            return res.status(400).json({
                                error: {
                                    message: `You must be the owner of this account to add items to its lists.`
                                }
                            })   
                        }
                    }
                }
                next();
            })
            .catch(next);

            const { title, date_added, list_id } = req.body;
            const newItem = { title, date_added, list_id };
    
            for (const [key, value] of Object.entries(newItem))  // Make sure all info is provided
                if (value === null) 
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body.  Valid list items must contain a list id of an already existing list, the title, and the date of creation`}
                })
    
            ListsService.addListItems(  // Insert the information
                req.app.get('db'),
                newItem
            )
            .then(item => {  
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${item.id}`))
                .json(serialItem(item))
            })
            .catch(next)
        });

        listsRouter
        .route('/deleteList/:id')
            .all(requireAPIKey)
            .all(requireAuth)
            .all((req, res, next) => {  // Delete a user list
                ListsService.getUserListsById(req.app.get('db'), req.user.id)
                .then(list => {
                    if (req.user.perm_level === "admin") { // Do not bother checking if list_id is in the found list
                        next();
                    } else {
                        for (const [key, value] of Object.entries(list)) {
                            if (key === "list_id") {
                                if (value !== req.params.id) {
                                    return res.status(400).json({
                                        error: {
                                            message: `You do not own the list you specified.  You must either be an admin or own this list to delete it.`
                                        }
                                    })   
                                }
                            }
                        }
                        next();
                    }
                }).catch(next);
            })
            .delete((req, res, next) => { 
                ListsService.deleteUserList(req.app.get('db'), req.params.id)
                .then(rows => {
                    res.status(204).end();
                })
                .catch(next);
            });

        listsRouter
        .route('/deleteListItem/:id')
            .all(requireAPIKey)
            .all(requireAuth)
            .all((req, res, next) => {  // Delete a user list
                ListsService.getUserListsById(req.app.get('db'), req.user.id)
                .then(list => {
                    if (req.user.perm_level === "admin") { // Do not bother checking if list_id is in the found list
                        next();
                    } else {
                        for (const [key, value] of Object.entries(list)) {
                            if (key === "list_id") {
                                if (value !== req.params.id) {
                                    return res.status(400).json({
                                        error: {
                                            message: `This item belongs to a list not owned by you. You must either be an admin or own this list item to delete it.`
                                        }
                                    })   
                                }
                            }
                        }
                        next();
                    }
                }).catch(next);
            })
            .delete((req, res, next) => { 
                ListsService.deleteUserListItem(req.app.get('db'), req.params.id)
                .then(rows => {
                    res.status(204).end();
                })
                .catch(next);
            });

    module.exports = listsRouter