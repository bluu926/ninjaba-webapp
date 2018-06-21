import { AUTH_USER, AUTH_ERROR, AUTH_USER_EMAIL } from '../actions/types';

const INITIAL_STATE = {
  authenticated: '',
  userEmailAddress: '',
  errorMessage: ''
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return {...state, authenticated: action.payload };
    case AUTH_USER_EMAIL:
      return {...state, userEmailAddress: action.payload };
    case AUTH_ERROR:
      return {...state, errorMessage: action.payload };
    default:
      return state;
  }
}
