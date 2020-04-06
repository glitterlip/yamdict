// @flow
import React, { Component } from 'react';
import Podcast from '../components/Podcast/Podcast';

import { connect } from 'react-redux';
import { defaultFunctions } from '../reducers';

function mapStateToProps(state) {
  return {
    dict: state.dict,
    setting: state.setting
  };
}

function mapDispatchToProps(dispatch,ownProps) {

  return { ...defaultFunctions(dispatch) };

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Podcast);

