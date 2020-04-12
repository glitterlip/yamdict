// @flow
import React, { Component } from 'react';
import Discover from '../../components/Podcast/Discover';

import { connect } from 'react-redux';
import { defaultFunctions, defaultProps } from '../../reducers';

function mapStateToProps(state) {
  return { ...defaultProps(state) };
}

function mapDispatchToProps(dispatch,ownProps) {

  return { ...defaultFunctions(dispatch) };

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Discover);

