import { TRANSACTIONS_ERRORED, TRANSACTIONS_SUCCESS, TRANSACTIONS_LIST } from '../actions/types';

const INITIAL_STATE = {
  transactionsSuccess: '',
  transactionsErrored: '',
  transactions: [],
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TRANSACTIONS_SUCCESS:
      return {...state, transactionsSuccess: action.payload };
    case TRANSACTIONS_ERRORED:
      return {...state, transactionsErrored: action.payload };
    case TRANSACTIONS_LIST:
      return {...state, transactions: action.payload.transactionsList };
    default:
      return state;
  }
}
