import * as config from '../config';
import axios from 'axios';
import { WAIVEE_LIST_SUCCESS, WAIVEE_LIST_ERRORED, WAIVEE_PLAYERS_LIST } from './types';

export const getOwnerWaivees = (waiveeProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: '' });
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waivee/getOwnerWaivees`, waiveeProps);

    dispatch({ type: WAIVEE_PLAYERS_LIST, payload: response.data });
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Obtained ownders list of waivers successfully.' });
  } catch(e) {
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: 'Error getting waivers list.' });
  }
};

export const cancelWaivee = (waiveeProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: '' });
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waivee/cancelWaivee`, waiveeProps);

    dispatch({ type: WAIVEE_PLAYERS_LIST, payload: response.data });
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Waiver cancelled successfully.' });
  } catch(e) {
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: 'Erro cancelling waiver.' });
  }
};
