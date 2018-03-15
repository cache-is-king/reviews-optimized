const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost/silverspoon_reviews';

mongoose.connect(MONGO_URL, (err) => {
  if (err) console.log('Mongo Error', err);
});

const restaurantSchema = mongoose.Schema({
  restaurantId: Number,
  restaurantName: String,
  restaurantReviews: [
    {
      username: String,
      city: String,
      dinedDate: Date,
      rating: Number,
      review: String,
    },
  ],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

function insertOne(restaurant, callback) {
  Restaurant.create(restaurant, callback);
}

function findByRestaurantId(id) {
  // Restaurant.find({ restaurantId: id }).exec(callback);

  // promise version
  return Restaurant.find({ restaurantId: id });
}

function findOneByRestaurantId(id) {
  // Restaurant.findOne({ restaurantId: id }).exec(callback);

  // promise version
  return Restaurant.findOne({ restaurantId: id });
}

module.exports.insertOne = insertOne;
module.exports.findByRestaurantId = findByRestaurantId;
module.exports.findOneByRestaurantId = findOneByRestaurantId;
module.exports.mongoose = mongoose;
module.exports.Restaurant = Restaurant;
