import authActions from '../Actions/authActions'; // Import as default

const initialState = {
  userData: {},
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authActions.SET_USER_DATA:
      return {
        ...state,
        userData: action.userData,
      };

    case authActions.CLEAR_DATA:
      return {
        ...state,
        userData: {},
      };

    case authActions.SET_BOOKS_LIST:
      return {
        ...state,
        booksList: action.booksList,
      };
      
    default:
      return state;
  }
}