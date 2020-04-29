const CommentsService = {
    getCommentsByMovie(knex, movie_id){
        return knex.select('*').from('user_comments').where({ movie_id: movie_id });
    },
    getCommentByUser(knex, user_id){
        return knex.select('*').from('user_comments').where({ user_id: user_id });
    },
    getCommentById(knex, id){
        return knex.select('*').from('user_comments').where({ id: id }).first();
    },
    addComment(knex, comment) {
        return knex
        .insert(comment)
        .into('user_comments')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    deleteCommentById(knex, id) {
        return knex('user_comments').where({ id }).delete();
    },
    updateCommentById(knex, id, newComment) {
        return knex('user_comments').where({ id }).update(newComment);
    }
}

module.exports = CommentsService;