import { PLAYERS_HAS_ERRORED, PLAYERS_IS_LOADING, PLAYERS_FETCH_DATA_SUCCESS  } from './types';
import axios from 'axios';

const API_URL = 'http://localhost:3090/api';

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
    const response = await axios.get(url, {headers: {
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
    const response = await axios.get(`${API_URL}/playertransaction/${playerId}/${username}/${transactionType}`, {headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    // const temp = await axios.get('http://localhost:3090/players', {headers: {
    //     "Authorization" : localStorage.getItem('token')
    //   }});
    //
    // dispatch(playersFetchDataSuccess(response.data.playerList));

  } catch(e) {

  }
}
