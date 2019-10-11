export const SET_THEME = 'SET_THEME';
export const SET_SCORE = 'SET_SCORE';

export function toggleTheme() {
  return (dispatch, getState) => {
    const { setting } = getState();
    dispatch(changeTheme(setting.theme === 'dark' ? 'light' : 'dark'));
  };
}

export const changeTheme = theme => {
  return {
    type: SET_THEME,
    theme
  };
};

export function setScore(score) {
  return {
    type: SET_SCORE,
    score
  };
}
