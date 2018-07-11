import { WAIVEE_LIST_SUCCESS, WAIVEE_LIST_ERRORED, WAIVEE_PLAYERS_LIST, OWNER_LIST_SUCCESS, OWNER_LIST_ERRORED, OWNER_LIST } from '../actions/types';

const INITIAL_STATE = {
  waiveeListSuccess: '',
  waiveeListErrored: '',
  waiveePlayersList: [],
  ownerListSuccess: '',
  ownerListErrored: '',
  ownerList: []
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case WAIVEE_LIST_SUCCESS:
      return {...state, waiveeListSuccess: action.payload };
    case WAIVEE_LIST_ERRORED:
      return {...state, waiveeListErrored: action.payload };
    case WAIVEE_PLAYERS_LIST:
      return {...state, waiveePlayersList: action.payload.waiveeList };
    case OWNER_LIST_SUCCESS:
      return {...state, ownerListSuccess: action.payload };
    case OWNER_LIST_ERRORED:
      return {...state, ownerListErrored: action.payload };
    case OWNER_LIST:
      return {...state, ownerList: action.payload.ownerList };
    default:
      return state;
  }
}
