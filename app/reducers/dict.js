// @flow
import { SET_DICT, SET_RESULT } from '../actions/dict';

export default function dict(state = { result: '', engine: null }, action) {
  switch (action.type) {
    case SET_DICT:
      return {
        ...state,
        engine: action.dict
      };

    case SET_RESULT:
      return {
        ...state,
        result: action.result
      };
    default:
      return state;
  }
}
