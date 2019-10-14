// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import dict from './dict';
import setting from './setting';
import * as DictActions from '../actions/dict';
import * as SettingActions from '../actions/setting';

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    counter,
    dict,
    setting
  });
}

export const defaultFunctions = (dispatch) => {
  return {
    setDict: (parser) => {
      dispatch(DictActions.setDict(parser));
    },
    setResult: (result) => {
      dispatch(DictActions.setResult(result));
    },
    toggleTheme: () => {
      dispatch(SettingActions.toggleTheme());
    },
    setWord: (word) => {
      dispatch(DictActions.setWord(word));
    },
    setScore: (score) => {
      dispatch(SettingActions.setScore(score));
    },
    setPredictions: (predictions) => {
      dispatch(DictActions.setPredictions(predictions));
    }
  };
};


export const defaultProps = ({dict,setting}) => {
  return {
    dict, setting
  };
};
