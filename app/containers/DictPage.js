// @flow
import React from 'react';
import Dict from '../components/Dicts/Dict';

import { connect } from 'react-redux';
import { defaultFunctions, defaultProps } from '../reducers';

function mapStateToProps(state) {
  return { ...defaultProps(state) };
}

function mapDispatchToProps(dispatch, ownProps) {

  return { ...defaultFunctions(dispatch) };

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dict);

