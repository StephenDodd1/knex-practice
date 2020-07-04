const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
   client: 'pg',
   connection: process.env.DB_URL
})

searchFunction = (searchTerm) => {
   knexInstance('shopping_list')
   .select('*')
   .where('name', ILIKE,`%${searchTerm}%`)
   .first()
   .then(
      result => {
         console.log('SEARCH TERM', {searchTerm})
         console.log(result)
      }
   );
}
searchFunction('term')

paginateItems = (page) => {
   const limit = 6
   const offset = limit * (page - 1)
   knexInstance
     .select('*')
     .from('shopping_list')
     .limit(limit)
     .offset(offset)
     .then(result => {
       console.log('PAGINATE ITEMS', { page })
       console.log(result)
     })
}
paginateItems(2)

previouslyAddedProducts = (days) => {
   knexInstance
   .select('id', 'name', 'price', 'date_added', 'checked', 'category')
   .from('shopping_list')
   .where(
     'date_added',
     '>',
     knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
   )
   .then(results => {
     console.log('PRODUCTS ADDED DAYS AGO')
     console.log(results)
   })
}
previouslyAddedProducts(5)

costPerCategory = () => {
   knexInstance
   .select('category')
   .sum('price as total')
   .from('shopping_list')
   .groupBy('category')
   .then(result => {
     console.log('COST PER CATEGORY')
     console.log(result)
   })
}
costPerCategory()