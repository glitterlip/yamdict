// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import * as DictActions from '../actions/dict';
import * as SettingActions from '../actions/setting';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    dict: state.dict,
    setting: state.setting
  };
}

function mapDispatchToProps(dispatch) {

  return {
    setDict: (parser) => {
      dispatch(DictActions.setDict(parser));
    },
    setResult: (result) => {
      dispatch(DictActions.setResult(result));
    },
    toggleTheme: () => {
      dispatch(SettingActions.toggleTheme());
    }
  };
  // return bindActionCreators(DictActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

