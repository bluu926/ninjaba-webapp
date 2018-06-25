import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import { playersIsLoading, playersHasErrored, players, playersTransactionSuccess, playersTransactionErrored } from './players';

export default combineReducers({
  auth,
  playersIsLoading,
  playersHasErrored,
  players,
  playersTransactionSuccess,
  playersTransactionErrored,
  form: formReducer
});
