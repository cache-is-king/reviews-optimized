const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost/silverspoon_reviews';

mongoose.connect(MONGO_URL);

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

function findByRestaurantId(id, callback) {
  Restaurant.find({ restaurantId: id }).exec((err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

module.exports.insertOne = insertOne;
module.exports.findByRestaurantId = findByRestaurantId;
