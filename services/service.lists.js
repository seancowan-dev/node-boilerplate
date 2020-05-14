const toUUID = require('to-uuid').toUUID;

const ListsService = {
    getAllLists(knex){
        return knex.select('*').from('user_lists');
    },
    getUserListsById(knex, user_id){
        return knex.raw(`SELECT l.id, l.user_id, l.list_name, i.id as item_id, i.title, i.date_added, i.list_id
        FROM user_lists l
        FULL JOIN list_items i
        ON l.id = i.list_id
        WHERE l.user_id = '${user_id}'`);
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
    deleteUserListItem(knex, id) {
        return knex('list_items').where({ id: id }).delete();
    },
    updateUserList(knex, id, newList) {
        return knex('user_lists').where({ id }).update(newList);
    },
    updateListItems(knex, id, newItem) {
        return knex('list_items').where({ id }).update(newItem);
    },
}

module.exports = ListsService