// @flow
import React, { Component } from 'react';
import Translate from '../components/Translate/Translate';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    dict: state.dict,
    setting: state.setting
  };
}

function mapDispatchToProps(dispatch,ownProps) {

  return {

  };
  // return bindActionCreators(DictActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Translate);

