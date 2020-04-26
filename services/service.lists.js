const ListsService = {
    getAllLists(knex){
        return knex.select('*').from('user_lists').innerJoin('list_items', 'user_lists.id', 'list_items.list_id');
    },
    getUserListsById(knex, user_id){
        return knex.select('*').from('user_lists').innerJoin('list_items', 'user_lists.id', 'list_items.list_id').where({user_id: user_id});
    },
    addList(knex, list) {
        return knex
        .insert(list)
        .into('user_lists')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    addListItems(knex, items) {
        return knex
        .insert(items)
        .into('list_items')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    deleteUserList(knex, id) {
        return knex('user_lists').where({ id }).delete();
    },
    deleteUserListItem(knex, id, list_id) {
        return knex('user_lists').where({ id: id, list_id: list_id }).delete();
    },
    updateUserList(knex, id, newList) {
        return knex('user_lists').where({ id }).update(newUser);
    },
    updateListItems(knex, list_id, newItem) {
        return knex('list_items').where({ list_id }).update(newItem);
    },
}

module.exports = ListsService