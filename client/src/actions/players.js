import { ITEMS_HAS_ERRORED, ITEMS_IS_LOADING, ITEMS_FETCH_DATA_SUCCESS  } from './types';

export function itemsHasErrored(bool) {
  return {
    type: ITEMS_HAS_ERRORED,
    hasErrored: bool
  };
}

export function itemsIsLoading(bool) {
  return {
    type: ITEMS_IS_LOADING,
    isLoading: bool
  };
}

export function itemsFetchDataSuccess(items) {
  return {
    type: ITEMS_FETCH_DATA_SUCCESS,
    items
  };
}

export function itemsFetchData = (url) => async dispatch => {
  try {

    dispatch(itemsIsLoading(true));
    const response = await axios.get(url);
    dispatch(itemsIsLoading(false));
    dispatch(itemsFetchDataSuccess(response.data));
  } catch(e) {
    dispatch(itemsHasErrored(true));
  }

    // return (dispatch) => {
    //     dispatch(itemsIsLoading(true));
    //
    //     fetch(url)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw Error(response.statusText);
    //             }
    //
    //             dispatch(itemsIsLoading(false));
    //
    //             return response;
    //         })
    //         .then((response) => response.json())
    //         .then((items) => dispatch(itemsFetchDataSuccess(items)))
    //         .catch(() => dispatch(itemsHasErrored(true)));
    // };
}
