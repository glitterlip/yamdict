import { PLAYER_STATUS, PLAYER_PLAY, PLAYER_LIST_ADD } from '../actions/player';

export default function player(state = { play: false, list: [], current: null }, action) {
  switch (action.type) {
    case PLAYER_STATUS:
      return {
        ...state,
        play: !state.play
      };
    case PLAYER_PLAY:
      let list=state.list;
      list.push(action.podcast);
      return {
        ...state,
        list,
        current: action.podcast,
        play: true

      };
    case PLAYER_LIST_ADD:
      return {
        ...state,
        list: state.list.push(action.item)
      };

    default:
      return state;
  }
}
