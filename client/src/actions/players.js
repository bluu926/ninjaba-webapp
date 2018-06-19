import { PLAYERS_HAS_ERRORED, PLAYERS_IS_LOADING, PLAYERS_FETCH_DATA_SUCCESS  } from './types';
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
    const response = await axios.get(url);
    dispatch(playersIsLoading(false));
    dispatch(playersFetchDataSuccess(response.data.playerList));
  } catch(e) {
    dispatch(playersHasErrored(true));
  }

    // return (dispatch) => {
    //     dispatch(itemsIsLoading(true));
    //
    //     fetch(url)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw Error(response.statusText);
    //             }
    //
    //             dispatch(itemsIsLoading(false));
    //
    //             return response;
    //         })
    //         .then((response) => response.json())
    //         .then((items) => dispatch(itemsFetchDataSuccess(items)))
    //         .catch(() => dispatch(itemsHasErrored(true)));
    // };
}
