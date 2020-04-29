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
    reply: xss(comment.reply),
    movie_id: xss(comment.movie_id),
    replying_comment: xss(comment.replying_comment),
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
            res.status(200).json(comments.map(serial));
        })
        .catch(next);
    });
commentsRouter
    .route('/get/user/:id') // Get comments by user ID
    .all(requireAPIKey)
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
    .all(requireAuth)
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        const { id, user_id, reply, movie_id, replying_comment, comment, updated_at } = req.body;
        const newComment = { id, user_id, reply, comment, updated_at };

        // Only users can post comments under their name
        if (user_id !== req.user.id) {
            return res.status(400).json({
                error: { message: `Cannot post comments under a different user's ID`}
            })            
        }

        // Comment can have both, but *must* a movie_id 
        // and if they have reply === true must have a replying_comment id

        if (movie_id === undefined) {
            return res.status(400).json({
                error: { message: `Movie ID cannot be empty when posting a comment.`}
            })
        }
        newComment.movie_id = movie_id;
        if (reply === true) {
            if (replying_comment === undefined) {
                return res.status(400).json({
                    error: { message: `A reply cannot be posted without a corresponding comment ID to reply to.`}
                })
            }
            newComment.replying_comment = replying_comment;
        }

        CommentsService.addComment(req.app.get('db'), newComment)
        .then(comment => {
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${comment.id}`))
            .json(serial(comment))
        })
        .catch(next)
    });

    module.exports = commentsRouter;