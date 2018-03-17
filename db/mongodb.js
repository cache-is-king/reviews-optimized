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

function insertOne(restaurant) {
  return Restaurant.create(restaurant);
}

function findByRestaurantId(id) {
  return Restaurant.find({ restaurantId: id }).limit(1).lean();
}

function findByRestaurantName(name) {
  return Restaurant.find({ restaurantName: name }).limit(1).lean();
}

module.exports.insertOne = insertOne;
module.exports.findByRestaurantId = findByRestaurantId;
module.exports.findByRestaurantName = findByRestaurantName;
module.exports.mongoose = mongoose;
