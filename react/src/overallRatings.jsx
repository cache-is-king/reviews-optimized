import React from 'react';
import PropTypes from 'prop-types';

const OverallRatings = ({ restaurants }) => (
  <div>
    {restaurants.map((restaurant) => {
      const reviews = restaurant.restaurantReviews;
      const revNum = reviews.length;
      const avgRating = reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        : 'N/A';
      const foodRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      const serviceRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      const ambienceRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      const valueRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      const pctRecommend = Math.floor(70 + (Math.random() * 30));
      const noiseLevel = ['Quiet', 'Moderate', 'Loud'][restaurant.restaurantId % 3];
      const imgString = 'data:image/png;base64,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';

    return (
      <div>
        <div className="restaurantName">
          <span><img src={imgString} alt="logo" />
          </span>{restaurant.restaurantName} Ratings and Reviews
          <div className="overallrating">
            <span className="graph">
              <ul className="bargraph">
                5<li className="reddeep" />
                4<li className="redpink" />
                3<li className="pink" />
                2<li className="orangered" />
                1<li className="orange" />
              </ul>
            </span>
            <span className="ratingNum">{avgRating === 'N/A' ? 'N/A' : avgRating.toFixed(1)}</span>
            <span className="overall">Overall Rating</span>
            <div className="stars">
              <span>☆</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div className="mood">
              <span>Food: {foodRating}</span>
              | <span>Service: {serviceRating}</span>
              | <span>Ambience: {ambienceRating}</span>
              | <span>Value: {valueRating}</span>
              | <span>Noise: {noiseLevel}</span>
            </div>
            <div className="recommendText">
              <i className="glyphicon glyphicon-thumbs-up" />
              {pctRecommend}% would recommend it to a friend
            </div>
            <div className="reviewsCount">{revNum} review{revNum !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
      );
    })}
  </div>
);

OverallRatings.propTypes = {
  restaurants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default OverallRatings;
