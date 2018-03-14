import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../react/src/app';
// import OverallRatings from '../react/src/overallRatings.jsx';
// import Restaurants from '../react/src/restaurants.jsx';
// import ReviewsList from '../react/src/reviewsList.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('App Component', () => {
  test('should render correctly', () => {
    expect(Enzyme.shallow(<App />)).toMatchSnapshot();
  });
});
