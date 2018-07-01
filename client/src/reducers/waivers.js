import { WAIVER_ADD_SUCCESS, WAIVER_ADD_ERRORED, WAIVER_OWNER_DROPS } from '../actions/types';

const INITIAL_STATE = {
  waiverAddSuccess: '',
  waiverAddErrored: '',
  waiverPlayersToDrop: [],
  waiverPlayersToDropCount: 0
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case WAIVER_ADD_SUCCESS:
      return {...state, waiverAddSuccess: action.payload };
    case WAIVER_ADD_ERRORED:
      return {...state, waiverAddErrored: action.payload };
    case WAIVER_OWNER_DROPS:
      return {...state, waiverPlayersToDrop: action.payload.playerToDropList, waiverPlayersToDropCount: action.payload.playerCount  };
    default:
      return state;
  }
}
