const UsersService = {
    getAllUsers(knex){
        return knex.select('*').from('registered_users');
    },
    addUser(knex, user) {
        return knex
        .insert(user)
        .into('registered_users')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    getUserById(knex, id) {
        return knex.from('registered_users').select('*').where('id', id).first();
    },
    deleteUser(knex, id) {
        return knex('registered_users').where({ id }).delete();
    },
    updateUser(knex, id, newUser) {
        return knex('registered_users').where({ id }).update(newUser);
    },
}

module.exports = UsersService