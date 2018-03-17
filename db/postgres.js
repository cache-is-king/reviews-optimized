const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new pg.Client();

client.on('error', (err) => {
  console.log('Postgres error', err);
});

client.on('end', () => {
  console.log('Postgres disconnect');
});

client.connect();

const findRestaurantById = id => client.query('SELECT * FROM restaurants WHERE restaurantid=$1', [id]);

const findRestaurantByName = name => client.query('SELECT * from restaurants WHERE restaurantname=$1', [name]);

const findReviewsById = id => client.query('SELECT * FROM reviews WHERE restaurantid=$1', [id]);

const findReviewsByName = name => client.query('SELECT * FROM reviews WHERE restaurantid=(SELECT restaurantid FROM restaurants WHERE restaurantname=$1 LIMIT 1)', [name]);

// aggregate the data and return as JSON object to mimic Mongo
// const findByRestaurantId = (id) =>{};
//   return Promise.all([
//     findRestaurantById(id),
//     findReviewsById(id)])
//     .then(([restaurantInfo, reviews]) => {
//       return {
//         restaurantName: restaurantInfo.restaurantName,
//         restaurantReviews: reviews.rows.map(row => {

//         })
//       }
//     })
// }

// const findByRestaurantName = (name) {};


module.exports = {
  client,
  findRestaurantById,
  findRestaurantByName,
  findReviewsById,
  findReviewsByName,
};
