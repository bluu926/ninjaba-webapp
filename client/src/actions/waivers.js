import * as config from '../config';
import axios from 'axios';
import { WAIVER_ADD_SUCCESS, WAIVER_ADD_ERRORED } from './types';

export const addWaiver = (waiverProps, callback) => async dispatch => {
  try {
    const response = await axios.post(`${config.API_URL}/addWaiver`, waiverProps);

    dispatch({ type: WAIVER_ADD_SUCCESS, payload: response.data.message });
  } catch(e) {
    dispatch({ type: WAIVER_ADD_ERRORED, payload: e.response.data.error });
  }
};
