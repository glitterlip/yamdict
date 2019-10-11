// @flow
import { SET_SCORE, SET_THEME } from '../actions/setting';

export default function setting(state = { theme: 'dark', score: 0 }, action) {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.theme
      };
    case SET_SCORE:
      return {
        ...state,
        score: action.score
      };

    default:
      return state;
  }
}
