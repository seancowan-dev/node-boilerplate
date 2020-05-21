const path = require('path');
const express = require('express');
const xss = require('xss');
const CommentsService = require('../services/service.comments');
const { requireAPIKey } = require('../middleware/auth');
const { requireAuth } = require('../middleware/loginAuth');
const commentsRouter = express.Router()
const bodyParser = express.json()

const serial = comment => ({
    id: xss(comment.id),
    user_id: xss(comment.user_id),
    movie_id: xss(comment.movie_id),
    replying_to: xss(comment.replying_to),
    comment: xss(comment.comment),
    updated_at: xss(comment.updated_at)
});

commentsRouter
    .route('/get/:id') // Get single comments by comment ID
    .all(requireAPIKey)
    .get((req, res, next) => {
        CommentsService.getCommentById(req.app.get('db'), req.params.id)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    error: { message: `Could not find comment with id: ${req.params.id}.  Perhaps it was deleted?` }
                })                
            }
            res.status(200).json(serial(comment));
        })
        .catch(next);
    });

commentsRouter
    .route('/reply/get/:id') // Get single replies by ID
    .all(requireAPIKey)
    .get((req, res, next) => {
        CommentsService.getReplyById(req.app.get('db'), req.params.id)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    error: { message: `Could not find comment with id: ${req.params.id}.  Perhaps it was deleted?` }
                })                
            }
            res.status(200).json(serial(comment));
        })
        .catch(next);
    });

commentsRouter
    .route('/get/movie/:id') // Get comments by movie ID
    .all(requireAPIKey)
    .get((req, res, next) => {
        CommentsService.getCommentsByMovie(req.app.get('db'), req.params.id)
        .then(comments => {
            if (!comments) {
                return res.status(404).json({
                    error: { message: `Could not find comments with movie id: ${req.params.id}.` }
                })                
            }
            res.status(200).send(comments.rows);
        })
        .catch(next);
    });


commentsRouter
    .route('/get/user/:id') // Get comments by user ID
    .all(requireAPIKey)
    .all(requireAuth)
    .get((req, res, next) => {
        CommentsService.getCommentByUser(req.app.get('db'), req.params.id)
        .then(comments => {
            if (!comments) {
                return res.status(404).json({
                    error: { message: `Could not find comments from user with id: ${req.params.id}.` }
                })                
            }
            res.status(200).json(comments.map(serial));
        })
        .catch(next);
    });


commentsRouter
    .route('/add')
    .all(requireAPIKey)
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        const { user_name, user_id, reply, movie_id, replying_to, comment, updated_at } = req.body;
        const newComment = { user_name, user_id, comment, updated_at };
        const requiredVals = { user_name, user_id, reply, comment, updated_at }

        //Note the reply field must be supplied by JSON to the endpoint, however this is not stored in the database
        //It is purely to make things easier on the client side when  handling post buttons for comments

        // Ensure essential vals are present
        const numOfVals = Object.values(requiredVals).filter(Boolean).length;  // Make sure request has all info
        if(numOfVals === 0) {
            return res.status(400).json({
                error: {
                    message: `Missing required comment information, please check that you have provided a user_name, a boolean value for whether this is a reply or not, the comment, and a timestamptz of the update.`
                }
            })
        }
        // Only users can post comments under their name
        if (user_id !== req.user.id) {
            return res.status(400).json({
                error: { message: `Cannot post comments under a different user's ID`}
            })            
        }

        // Comment can have both, but *must* have a movie_id 
        // and if they have reply === true must have a replying_comment id

        if (movie_id === undefined) {
            return res.status(400).json({
                error: { message: `Movie ID cannot be empty when posting a comment.`}
            })
        }
        newComment.movie_id = movie_id;
        if (reply === "true") {
            if (replying_to === undefined) {
                return res.status(400).json({
                    error: { message: `A reply cannot be posted without a corresponding comment ID to reply to.`}
                })
            }
            newComment.replying_to = replying_to;
            CommentsService.addReply(req.app.get('db'), newComment)
            .then(comment => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${comment.id}`))
                .json(serial(comment))
            })
            .catch(next)
        }

        if (reply === "false") {
            CommentsService.addComment(req.app.get('db'), newComment)
            .then(comment => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${comment.id}`))
                .json(serial(comment))
            })
            .catch(next)
        }
    });


commentsRouter
    .route('/delete/:id')
    .all(requireAPIKey)
    .all(requireAuth)
    .delete(bodyParser, (req, res, next) => {
        // Only comment owners or admins can delete
        if (req.user.perm_level === "admin" || user_id === req.user.id) {
           CommentsService.deleteCommentById(req.app.get('db'), req.params.id)
           .then(rows => {
                res.status(204).json({ message: "Delete comment successful"})
            })
            .catch(next);           
        } else {
            return res.status(400).json({
                error: { message: `You must be the owner of this comment or an admin to delete it.`}
            }) 
        }
    });

    commentsRouter
    .route('/delete/reply/:id')
    .all(requireAPIKey)
    .all(requireAuth)
    .delete(bodyParser, (req, res, next) => {
        // Only comment owners or admins can delete
        if (req.user.perm_level === "admin" || user_id === req.user.id) {
           CommentsService.deleteReplyById(req.app.get('db'), req.params.id)
           .then(rows => {
                res.status(204).json({ message: "Delete reply successful"})
            })
            .catch(next);           
        } else {
            return res.status(400).json({
                error: { message: `You must be the owner of this comment or an admin to delete it.`}
            }) 
        }
    });

commentsRouter
    .route('/update/:id')
    .all(requireAPIKey)
    .all(requireAuth)
    .patch(bodyParser, (req, res, next) => {
        const { user_id, reply, movie_id, replying_to, comment, updated_at } = req.body;
        const newComment = { user_id, comment, updated_at };

        // Only users can post comments under their name
        if (user_id !== req.user.id) {
            return res.status(400).json({
                error: { message: `Cannot post comments under a different user's ID`}
            })            
        }

        // Comment can have both, but *must* a movie_id 
        // and if they have reply === true must have a replying_to id
        if (movie_id === undefined) {
            return res.status(400).json({
                error: { message: `Movie ID cannot be empty when posting a comment.`}
            })
        }
        newComment.movie_id = movie_id;
        if (reply === "true") {
            if (replying_to === undefined) {
                return res.status(400).json({
                    error: { message: `A reply cannot be posted without a corresponding comment ID to reply to.`}
                })
            }
            newComment.replying_to = replying_to;
            CommentsService.updateReplyById(req.app.get('db'), req.params.id, newComment)
            .then(rows => {
                return res.status(201).location(path.posix.join(req.originalUrl, `/${req.params.id}`))
                .json(newComment);
            })
            .catch(next)
        }
        if (reply === "false") {
            CommentsService.updateCommentById(req.app.get('db'), req.params.id, newComment)
            .then(rows => {
                return res.status(201).location(path.posix.join(req.originalUrl, `/${req.params.id}`))
                .json(newComment);
            })
            .catch(next)
        }
    });  

    module.exports = commentsRouter;