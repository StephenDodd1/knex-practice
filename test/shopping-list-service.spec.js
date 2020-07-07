const ShoppingListService = require('../src/shopping-list-service.js');
require('dotenv').config();
const knex = require('knex');

describe('Shopping List Service Object', () => {

   let db
   let testList = [
      {
         id: 12001,
         name: 'Bologna',
         price: "1.99",
         date_added: new Date('2019-02-22T23:33:43.615Z'),
         checked: false,
         category: 'Lunch'
      },
      {
         id: 12002,
         name: 'Mystery Meat',
         price: "5.99",
         date_added: new Date('2012-12-22T23:33:43.615Z'),
         checked: false,
         category: 'Main'
      },
      {
         id: 12003,
         name: 'String Cheese',
         price: "3.99",
         date_added: new Date('2020-02-22T23:33:43.615Z'),
         checked: false,
         category: 'Breakfast'
      },
   ]
   before(() => {
      db = knex({
         client: 'pg',
         connection: process.env.TEST_DB_URL
      })
   })
   before(() => db('shopping_list').truncate())
   afterEach(() => db('shopping_list').truncate())
   after(()=> db.destroy())

   context('Given shopping_list has data', () => {
      beforeEach(() => {
         return db
            .into('shopping_list')
            .insert(testList)
         })
      it('should return the list items from shopping_list', () => {
         return ShoppingListService.getAllItems(db)
            .then(actual => {
               expect(actual).to.eql(testList.map(item => ({
                  ...item,
                  date_added: new Date(item.date_added)
               })))
            })
      })
      it('should render one article with getById()', () => {
         const specId = 12002
         const testSpecItem = testList[specId - 12001]
         return ShoppingListService.getById(db, specId)
            .then(actual => {
               expect(actual)
               .to.eql({
                  id: specId,
                  name: testSpecItem.name,
                  price: testSpecItem.price,
                  date_added: testSpecItem.date_added,
                  checked: testSpecItem.checked,
                  category: testSpecItem.category
               })
            })
         })
         it(`updateItem() updates an item object from the 'shopping_list' table`, () => {
            const itemIdToUpdate = 12002
            const newItemData = {
               name: 'updated name',
               date_added: new Date(),
               checked: true,
               category: 'Main',
               price: "5.99"
            }
            return ShoppingListService.updateItem(db, itemIdToUpdate, newItemData)
               .then(() => ShoppingListService.getById(db, itemIdToUpdate))
               .then(item => {
               expect(item).to.eql({
                  id: itemIdToUpdate,
                  ...newItemData,
               })
            })
         })
      })
   })
