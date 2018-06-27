import { WAIVER_ADD_SUCCESS, WAIVER_ADD_ERRORED } from '../actions/types';

const INITIAL_STATE = {
  waiverAddSuccess: '',
  waiverAddErrored: ''
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case WAIVER_ADD_SUCCESS:
      return {...state, waiverAddSuccess: action.payload };
    case WAIVER_ADD_ERRORED:
      return {...state, waiverAddErrored: action.payload };
    default:
      return state;
  }
}
