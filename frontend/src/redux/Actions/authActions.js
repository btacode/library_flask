const authActions = {
  // Action Types
  SET_USER_DATA: 'auth/SET_USER_DATA',
  CLEAR_DATA: 'auth/CLEAR_DATA',
  SET_BOOKS_LIST: 'auth/SET_BOOKS_LIST',

  // Action Creators
  setUserData: (data) => {
    return (dispatch) =>
      dispatch({
        type: authActions.SET_USER_DATA,
        userData: data,
      });
  },
  setBooksList: (data) => {
    return (dispatch) =>
      dispatch({
        type: authActions.SET_BOOKS_LIST,
        booksList: data,
      });
  },
  setClearData: () => {
    return (dispatch) =>
      dispatch({
        type: authActions.CLEAR_DATA,
      });
  },
};

// Export as default (not named export)
export default authActions;