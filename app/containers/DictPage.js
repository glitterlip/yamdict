// @flow
import React from 'react';
import Dict from '../components/Dicts/Dict';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    dict: state.dict,
    setting: state.setting
  };
}

function mapDispatchToProps(dispatch, ownProps) {

  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dict);

