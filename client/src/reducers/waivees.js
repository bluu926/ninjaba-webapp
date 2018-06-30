import { WAIVEE_LIST_SUCCESS, WAIVEE_LIST_ERRORED, WAIVEE_PLAYERS_LIST } from '../actions/types';

const INITIAL_STATE = {
  waiveeListSuccess: '',
  waiveeListErrored: '',
  waiveePlayersList: []
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case WAIVEE_LIST_SUCCESS:
      return {...state, waiveeListSuccess: action.payload };
    case WAIVEE_LIST_ERRORED:
      return {...state, waiveeListErrored: action.payload };
    case WAIVEE_PLAYERS_LIST:
      return {...state, waiveePlayersList: action.payload.waiveeList };
    default:
      return state;
  }
}
