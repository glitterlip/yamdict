// @flow
import React, { Component } from 'react';
import Note from '../components/Notes/Note';

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
)(Note);

