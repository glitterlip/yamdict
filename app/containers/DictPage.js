// @flow
import React from 'react';
import Dict from '../components/Dicts/Dict';

import { connect } from 'react-redux';
import { defaultFunctions } from '../reducers';

function mapStateToProps(state) {
  return {
    dict: state.dict,
    setting: state.setting
  };
}

function mapDispatchToProps(dispatch, ownProps) {

  return { ...defaultFunctions(dispatch) };

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dict);

