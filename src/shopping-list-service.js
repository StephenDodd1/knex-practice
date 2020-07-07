const ShoppingListService = {
   getAllItems(knex) {
      return knex.select('*').from('shopping_list')
   },
   getById(knex, id) {
      return knex.from('shopping_list').select('*').where('id',id).first();
   },
   updateItem(knex, id, itemUpdate) {
      return knex.from('shopping_list').where({ id }).update(itemUpdate)
   }
}
module.exports = ShoppingListService