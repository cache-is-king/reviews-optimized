const restaurantsData = require('./sampleData.js');
const reviewsList = require('./sample_reviews.js');
const mongoose = require('mongoose');
const db = require('./db/mongodb.js');

const getReviews = () => {
  // random length for how many reviews will render with minimum of 3 reviews
  const randomLength = Math.ceil(Math.random() * 10) + 3;
  const reviewsArray = [];
  // looping up to the random length
  for (let i = 1; i < randomLength; i += 1) {
    // random index generator
    const randomIdx = Math.floor(Math.random() * 100);
    // push random comments into array using randomIdx
    reviewsArray.push(reviewsList[randomIdx]);
  }
  // returns array of reviews
  return reviewsArray;
};

let counter = 0;
restaurantsData.forEach((restaurant) => {
  // for a restaurant, use schema to set values
  const eachRestaurant = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantReviews: getReviews(),
  };
  // save each one into db
  db.insertOne(eachRestaurant)
    .then(() => {
      counter += 1;
      if (counter === 119) {
        mongoose.disconnect();
      }
    })
    .catch((error) => {
      throw error;
    });
});
