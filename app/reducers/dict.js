// @flow
import { DISABLE_DICT, SET_DICT, SET_RESULT } from '../actions/dict';

export default function dict(state = { result: {}, engine: null }, action) {
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
    case DISABLE_DICT:
      return { ...state };
    default:
      return state;
  }
}
