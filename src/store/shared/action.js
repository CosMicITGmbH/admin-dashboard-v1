import {
  CLEAR_STATE,
  SET_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  UNSET_LOADING,
} from "./actionTypes";

export const setloading = () => ({
  type: SET_LOADING,
});

export const unsetLoading = () => ({
  type: UNSET_LOADING,
});

export const setSuccess = (message) => ({
  type: SET_SUCCESS,
  payload: message,
});

export const setError = (errorMsg) => ({
  type: SET_ERROR,
  payload: errorMsg,
});
export const clearStates = () => ({
  type: CLEAR_STATE,
});
