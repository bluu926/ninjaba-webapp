import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import { itemsIsLoading } from './items';

export default combineReducers({
  auth,
  itemsIsLoading,
  form: formReducer
});
