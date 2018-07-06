import { PLAYERS_HAS_ERRORED, PLAYERS_IS_LOADING, PLAYERS_FETCH_DATA_SUCCESS, PLAYERS_TRANSACTION_SUCCESS, PLAYERS_TRANSACTION_ERRORED } from './types';
import * as config from '../config';
import axios from 'axios';

export function playersHasErrored(bool) {
  return {
    type: PLAYERS_HAS_ERRORED,
    playersHasErrored: bool
  };
}

export function playersIsLoading(bool) {
  return {
    type: PLAYERS_IS_LOADING,
    playersIsLoading: bool
  };
}

export function playersFetchDataSuccess(players) {
  return {
    type: PLAYERS_FETCH_DATA_SUCCESS,
    players
  };
}

export function playersTransactionSuccess(bool) {
  return {
    type: PLAYERS_TRANSACTION_SUCCESS,
    playersTransactionSuccess: bool
  };
}

export function playersTransactionErrored(bool) {
  return {
    type: PLAYERS_TRANSACTION_ERRORED,
    playersTransactionErrored: bool
  };
}

export const playersFetchData = () => async dispatch => {
  try {
    dispatch(playersIsLoading(true));
    const response = await axios.get(`${config.API_URL}/players`, {headers: {
        "Authorization" : localStorage.getItem('token')
      }});
    dispatch(playersIsLoading(false));
    dispatch(playersFetchDataSuccess(response.data.playerList));
  } catch(e) {
    dispatch(playersHasErrored(true));
  }
}

export const playersTransaction = (playerId, username, transactionType) => async dispatch => {
  try {
    dispatch(playersTransactionSuccess(false));
    dispatch(playersTransactionErrored(false));

    await axios.get(`${config.API_URL}/playertransaction/${playerId}/${username}/${transactionType}`, {headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    const response = await axios.get(`${config.API_URL}/players`, {headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch(playersTransactionSuccess(true));
    dispatch(playersFetchDataSuccess(response.data.playerList));

  } catch(e) {
    dispatch(playersTransactionErrored(true));
  }
}
