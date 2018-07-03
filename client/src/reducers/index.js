import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import transaction from './transactions';
import waiver from './waivers';
import waivee from './waivees';
import { playersIsLoading, playersHasErrored, players, playersTransactionSuccess, playersTransactionErrored } from './players';

export default combineReducers({
  auth,
  transaction,
  waivee,
  waiver,
  playersIsLoading,
  playersHasErrored,
  players,
  playersTransactionSuccess,
  playersTransactionErrored,
  form: formReducer
});
