const UsersService = {
    addUser(knex, user) {
        return knex
        .insert(user)
        .into('registered_users')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    getAll(knex) {
        return knex.from('registered_users').select('*');
    },
    getUserById(knex, id) {
        return knex.from('registered_users').select('*').where('id', id).first();
    },
    getUserByName(knex, name) {
        return knex.from('registered_users')
        .where({ name })
        .first()
    },
    deleteUser(knex, id) {
        return knex('registered_users').where({ id }).delete();
    },
    updateUser(knex, id, newUser) {
        return knex('registered_users').where({ id }).update(newUser);
    },
}

module.exports = UsersService