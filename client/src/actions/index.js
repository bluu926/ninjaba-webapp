import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, AUTH_USER_EMAIL } from './types';
import * as config from '../config';

export const signup = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(`${config.API_URL}/signup`, formProps);

    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_USER_EMAIL, payload: formProps.email });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('email', formProps.email);
    callback();
  } catch(e) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  }
};

export const signin = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(`${config.API_URL}/signin`, formProps);

    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_USER_EMAIL, payload: formProps.email });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('email', formProps.email);
    callback();
  } catch(e) {
    dispatch({ type: AUTH_ERROR, payload: 'Invalid login credentials.' });
  }
};

export const signout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');

  return {
    type: AUTH_USER,
    payload: ''
  }
}
