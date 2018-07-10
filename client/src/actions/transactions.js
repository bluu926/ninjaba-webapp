import * as config from '../config';
import axios from 'axios';

import { TRANSACTIONS_ERRORED, TRANSACTIONS_SUCCESS, TRANSACTIONS_LIST } from './types';

export const getTransactions = () => async dispatch => {
  try {
    dispatch({ type: TRANSACTIONS_ERRORED, payload: '' });
    dispatch({ type: TRANSACTIONS_SUCCESS, payload: '' });

    const response = await axios.get(`${config.API_URL}/transaction/getTransactions`, { headers: {
        "Authorization" : localStorage.getItem('token')
      }});
    dispatch({ type: TRANSACTIONS_LIST, payload: response.data });
    dispatch({ type: TRANSACTIONS_SUCCESS, payload: 'Obtained transaction list successfully.' });
  } catch(e) {
    dispatch({ type: TRANSACTIONS_ERRORED, payload: 'Error getting transactions list.' });
  }
};
