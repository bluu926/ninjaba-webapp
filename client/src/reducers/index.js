import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import items from './items';

export default combineReducers({
  auth,
  item,
  form: formReducer
});
