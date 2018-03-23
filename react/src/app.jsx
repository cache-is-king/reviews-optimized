import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import OverallRatings from './overallRatings';
import Restaurants from './restaurants';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      data: [],
    };
    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    // const env = process.env.aws ? process.env.aws : '';
    $.ajax({
      url: `/restaurants/${this.state.id}/reviews`,
      method: 'GET',
      success: (data) => {
        this.setState({
          data,
        });
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }


  render() {
    return (
      <div>
        <OverallRatings restaurants={this.state.data} />
        <Restaurants restaurantsList={this.state.data} />
      </div>
    );
  }
}

App.propTypes = {
  id: PropTypes.number.isRequired,
};


export default App;
