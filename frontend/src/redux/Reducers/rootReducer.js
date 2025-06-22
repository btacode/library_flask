import { combineReducers } from 'redux';
import authReducer from './reducer'; // Make sure the import name matches

const rootReducer = combineReducers({
  auth: authReducer, // Use the imported authReducer
});

export default rootReducer;