// @flow
import React, { Component } from 'react';
import Favorites from '../components/Podcast/Favorites';

import { connect } from 'react-redux';
import { defaultFunctions, defaultProps } from '../reducers';

function mapStateToProps(state) {
  return { ...defaultProps(state) };
}

function mapDispatchToProps(dispatch) {

  return { ...defaultFunctions(dispatch) };

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Favorites);

