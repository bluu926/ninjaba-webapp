import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import waiver from './waivers';
import waivee from './waivees';
import { playersIsLoading, playersHasErrored, players, playersTransactionSuccess, playersTransactionErrored } from './players';

export default combineReducers({
  auth,
  waivee,
  waiver,
  playersIsLoading,
  playersHasErrored,
  players,
  playersTransactionSuccess,
  playersTransactionErrored,
  form: formReducer
});
