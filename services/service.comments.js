const CommentsService = {
    getCommentsByMovie(knex, movie_id){
        return knex.raw(`SELECT u.id, u.movie_id, u.user_name, u.user_id, u.comment, u.updated_at, r.id as rep_id, r.user_name as rep_user, r.replying_to, r.user_id as rep_user_id, r.comment as rep_comment, r.updated_at as rep_uat
        FROM user_comments u
        FULL JOIN reply_comments r
        ON u.id = r.replying_to
        WHERE u.movie_id = ${movie_id}
        ORDER BY u.id`);
    },
    getCommentByUser(knex, user_id){
        return knex.select('*').from('user_comments').where({ user_id: user_id });
    },
    getCommentById(knex, id){
        return knex.select('*').from('user_comments').where({ id: id }).first();
    },
    getReplyById(knex, id){
        return knex.select('*').from('reply_comments').where({ id: id }).first();
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
    addReply(knex, comment) {
        return knex
        .insert(comment)
        .into('reply_comments')
        .returning('*')
        .then(rows => {
            return rows[0]
        });     
    },
    deleteCommentById(knex, id) {
        return knex('user_comments').where({ id }).delete();
    },
    deleteReplyById(knex, id) {
        return knex('reply_comments').where({ id }).delete();
    },
    updateCommentById(knex, id, newComment) {
        return knex('user_comments').where({ id }).update(newComment);
    },
    updateReplyById(knex, id, newReply) {
        return knex('reply_comments').where({ id }).update(newReply);
    }
}

module.exports = CommentsService;