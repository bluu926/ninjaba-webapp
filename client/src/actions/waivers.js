import * as config from '../config';
import axios from 'axios';
import { WAIVER_ADD_SUCCESS, WAIVER_ADD_ERRORED, WAIVER_OWNER_DROPS } from './types';

export const addWaiver = (waiverProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVER_ADD_SUCCESS, payload: '' });
    dispatch({ type: WAIVER_ADD_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waiver/addWaiver`, waiverProps, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch({ type: WAIVER_ADD_SUCCESS, payload: response.data.message });
  } catch(e) {
    dispatch({ type: WAIVER_ADD_ERRORED, payload: e.response.data.error });
  }
};

export const getPlayersToDrop = (waiverProps, callback) => async dispatch => {
  try {
    dispatch({ type: WAIVER_ADD_SUCCESS, payload: '' });
    dispatch({ type: WAIVER_ADD_ERRORED, payload: '' });

    const response = await axios.post(`${config.API_URL}/waiver/getPlayersToDrop`, waiverProps, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});

    dispatch({ type: WAIVER_OWNER_DROPS, payload: response.data });

    dispatch({ type: WAIVER_ADD_SUCCESS, payload: response.data.message });
  } catch(e) {
    console.log(e.response.data);
    dispatch({ type: WAIVER_ADD_ERRORED, payload: e.response.data.error });
  }
};
