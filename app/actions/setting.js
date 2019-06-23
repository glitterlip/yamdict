export const SET_THEME = 'SET_THEME';

export function toggleTheme() {
  return (dispatch, getState) => {
    const { setting } = getState();
    dispatch(changeTheme(setting.theme === 'dark' ? 'light' : 'dark'));
  };
}

const changeTheme = theme => {
  return {
    type: SET_THEME,
    theme
  };
};
