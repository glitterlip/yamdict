export const PLAYER_STATUS = 'PLAYER_STATUS';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_LIST_ADD = 'PLAYER_LIST_ADD';


export const switchStatus = () => {
  return {
    type: PLAYER_STATUS
  };
};

export const play = (audio) => {

  return {
    type: PLAYER_PLAY,
    audio
  };
};

export const playlistAdd = (audio) => {

  return {
    type: PLAYER_LIST_ADD,
    audio
  };
};
