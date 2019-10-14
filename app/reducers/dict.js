// @flow
import { DISABLE_DICT, SET_DICT, SET_PREDICTIONS, SET_RESULT, SET_WORD } from '../actions/dict';

export default function dict(state = { result: {}, engine: null, word: '', predictions: [] }, action) {
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
    case SET_WORD:
      return {
        ...state,
        word: action.word
      };
    case SET_PREDICTIONS:
      return {
        ...state,
        predictions: action.predictions
      };
    default:
      return state;
  }
}
