import { PLAYERS_HAS_ERRORED, PLAYERS_IS_LOADING, PLAYERS_FETCH_DATA_SUCCESS  } from './types';
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

export const playersFetchData = (url) => async dispatch => {
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

export const playerTransaction = (playerId, username, transactionType) => async dispatch => {
  try {
    const response = await axios.get(`${config.API_URL}/playertransaction/${playerId}/${username}/${transactionType}`, {headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    const temp = await axios.get(`${config.API_URL}/players`, {headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch(playersFetchDataSuccess(temp.data.playerList));

  } catch(e) {

  }
}
