import React from 'react';
import PropTypes from 'prop-types';

const ReviewEntry = ({ review }) => {
  const imgString = 'data:image/png;base64,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';
  return (
    <div>
      <div className="ratings">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
        | Rating: {review.rating}
        | Username: {review.username}
        | City: {review.city}
        | Dined on {review.dinedDate.slice(0, 10)}
      </div>
      <div className="review">
        <span>
          <img src={imgString} alt="logo" />
        </span>
        {review.review}
        <div className="wasThisUseful">
          Was this review useful to you?
          <span> Yes. No. Report</span>
        </div>
      </div>
    </div>
  );
};

ReviewEntry.propTypes = {
  review: PropTypes.shape({
    rating: PropTypes.number,
    username: PropTypes.string,
    city: PropTypes.string,
    dinedDate: PropTypes.string,
  }).isRequired,
};

export default ReviewEntry;
