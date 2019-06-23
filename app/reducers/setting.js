// @flow
import { SET_THEME } from '../actions/setting';

export default function setting(state = { theme: 'dark' }, action) {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.theme
      };

    default:
      return state;
  }
}
