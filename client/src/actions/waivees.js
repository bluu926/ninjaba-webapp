import * as config from '../config';
import axios from 'axios';
import { WAIVEE_LIST_SUCCESS, WAIVEE_LIST_ERRORED, WAIVEE_PLAYERS_LIST, OWNER_LIST_SUCCESS, OWNER_LIST_ERRORED, OWNER_LIST } from './types';

export const getOwnersWaiverPriority = () => async dispatch => {
  try {
    dispatch({ type: OWNER_LIST_SUCCESS, payload: '' });
    dispatch({ type: OWNER_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waiver/getOwnersWaiverPriority`, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch({ type: OWNER_LIST, payload: response.data });
    // dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Obtained owners list of waivers successfully.' });
  } catch(e) {
    dispatch({ type: OWNER_LIST_ERRORED, payload: 'Error getting waivers list.' });
  }
}

export const getOwnerWaivees = (waiveeProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: '' });
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waivee/getOwnerWaivees`, waiveeProps, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch({ type: WAIVEE_PLAYERS_LIST, payload: response.data });
    // dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Obtained owners list of waivers successfully.' });
  } catch(e) {
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: 'Error getting waivers list.' });
  }
};

export const cancelWaivee = (waiveeProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: '' });
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waivee/cancelWaivee`, waiveeProps, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch({ type: WAIVEE_PLAYERS_LIST, payload: response.data });
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Waiver cancelled successfully.' });
  } catch(e) {
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: 'Erro cancelling waiver.' });
  }
};

export const changeWaiveeRank = (waiveeProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: '' });
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waivee/changeWaiveeRank`, waiveeProps, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch({ type: WAIVEE_PLAYERS_LIST, payload: response.data });
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Waiver moved successfully.' });
  } catch(e) {
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: e.response.data.error });
  }
};
