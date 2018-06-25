import { PLAYERS_HAS_ERRORED, PLAYERS_IS_LOADING, PLAYERS_FETCH_DATA_SUCCESS, PLAYERS_TRANSACTION_SUCCESS, PLAYERS_TRANSACTION_ERRORED } from '../actions/types';

export function playersHasErrored(state = false, action) {
    switch (action.type) {
        case PLAYERS_HAS_ERRORED:
            return action.playersHasErrored;

        default:
            return state;
    }
}

export function playersIsLoading(state = false, action) {
    switch (action.type) {
        case PLAYERS_IS_LOADING:
            return action.playersIsLoading;

        default:
            return state;
    }
}

export function players(state = [], action) {
    switch (action.type) {
        case PLAYERS_FETCH_DATA_SUCCESS:
            return action.players;

        default:
            return state;
    }
}

export function playersTransactionSuccess(state = false, action) {
    switch (action.type) {
        case PLAYERS_TRANSACTION_SUCCESS:
            return action.playersTransactionSuccess;

        default:
            return state;
    }
}

export function playersTransactionErrored(state = false, action) {
    switch (action.type) {
        case PLAYERS_TRANSACTION_ERRORED:
            return action.playersTransactionErrored;

        default:
            return state;
    }
}
