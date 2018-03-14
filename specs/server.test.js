const request = require('supertest');
const app = require('../server/server.js');

describe('Test the root path', () => {
  test('Server should connect to port', () => request(app).get('/').then((response) => {
    expect(response.statusCode).toBe(200);
  }));

  test('server.js returns 404 for "/random_url123"', () => {
    expect(true).toBe(true);
    return request(app).get('/random_url123')
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });


  // test('Should return error if no such restaurant', async () => {
  //   try {
  //     await Restaurant.findByRestaurantId(90976);
  //   } catch (err) {
  //     expect(err).toBeTruthy();
  //     expect(err.message).toEqual('Restaurant is not defined');
  //   }
  // });
});
