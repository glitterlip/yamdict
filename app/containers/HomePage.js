import React from 'react';
import Home from '../components/Home';

import { connect } from 'react-redux';
import { defaultFunctions, defaultProps } from '../reducers';

function mapStateToProps(state) {
  return {
    ...defaultProps(state)
  };
}

function mapDispatchToProps(dispatch) {

  return { ...defaultFunctions(dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

