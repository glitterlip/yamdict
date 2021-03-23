// @flow
import { SET_COLLAPSED, SET_SCORE, SET_THEME } from '../actions/setting';

export default function setting(state = { theme: 'dark', score: 0, collapsed: false }, action) {
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
    case SET_COLLAPSED:
      return {
        ...state,
        collapsed: action.collaspsed
      };
    default:
      return state;
  }
}
