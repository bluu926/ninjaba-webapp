import * as config from '../config';
import axios from 'axios';
import { WAIVEE_LIST_SUCCESS, WAIVEE_LIST_ERRORED, WAIVEE_PLAYERS_LIST } from './types';

export const getOwnerWaivees = (wavieeProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: '' });
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waivee/getOwnerWaivees`, wavieeProps);

    dispatch({ type: WAIVEE_PLAYERS_LIST, payload: response.data });
    dispatch({ type: WAIVEE_LIST_SUCCESS, payload: 'Obtained ownders list of waivers successfully.' });
  } catch(e) {
    dispatch({ type: WAIVEE_LIST_ERRORED, payload: e.response.data.error });
  }
};
