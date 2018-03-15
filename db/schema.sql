DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS restaurants;

CREATE TABLE restaurants (
  restaurantid INTEGER PRIMARY KEY,
  restaurantname VARCHAR(140) NOT NULL
  );

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  username VARCHAR(140) NOT NULL,
  city VARCHAR(140) NOT NULL,
  dineddate DATE NOT NULL,
  rating SMALLINT NOT NULL,
  review VARCHAR(2048) NOT NULL,
  restaurantid INTEGER
    REFERENCES restaurants
    ON DELETE NO ACTION
    ON UPDATE CASCADE
  );

-- INSERT INTO restaurants (restaurantid, restaurantname) VALUES (0, 'Double R Diner');

-- INSERT INTO reviews (username, city, dineddate, rating, review, restaurantid)
--   VALUES ('Batman', 'Gotham City', '2018-03-14', 2, 'When I am not watching over denizens of Gotham City, I dream about Norma''s pralines and pecan pie.', 0);

