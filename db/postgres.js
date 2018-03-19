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

const findRestaurantById = id => client.query('SELECT * FROM restaurants WHERE restaurantid=$1 LIMIT 1', [id]);

const findRestaurantByName = name => client.query('SELECT * from restaurants WHERE restaurantname=$1 LIMIT 1', [name]);

const findReviewsById = id => client.query('SELECT * FROM reviews WHERE restaurantid=$1', [id]);

const findReviewsByName = name => client.query('SELECT * FROM reviews WHERE restaurantid=(SELECT restaurantid FROM restaurants WHERE restaurantname=$1 LIMIT 1)', [name]);

// aggregate the data and return as JSON object to mimic Mongo
const findByRestaurantId = id => Promise.all([
  findRestaurantById(id),
  findReviewsById(id)])
  .then(([restaurantInfo, reviews]) => ({
    restaurantId: restaurantInfo.rows[0].restaurantid,
    restaurantName: restaurantInfo.rows[0].restaurantname,
    restaurantReviews: reviews.rows.map(row => ({
      username: row.username,
      city: row.city,
      dinedDate: row.dineddate.toISOString().slice(0, 10),
      rating: row.rating,
      review: row.review,
    })),
  }));


module.exports = {
  client,
  findRestaurantById,
  findRestaurantByName,
  findReviewsById,
  findReviewsByName,
  findByRestaurantId,
};
