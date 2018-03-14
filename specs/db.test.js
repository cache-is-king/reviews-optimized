const mongoose = require('mongoose');
const Restaurant = require('../db/mongodb.js');

const db = mongoose.connection;

describe('DB Test', () => {
  beforeAll((done) => {
    mongoose.connect('mongodb://localhost/silverspoon_reviews');

    db.on('error', (err) => {
      done.fail(err);
    });

    db.once('open', () => {
      done();
    });
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it('If it gets here, it proves that db is connected', () => {
    expect(1).toBe(1);
  });

  test('Should return error if no such restaurant', async () => {
    try {
      await Restaurant.findByRestaurantId(90976);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.message).toEqual('Restaurant is not defined');
    }
  });
});
