import {
  SET_SERVICE_FAIL,
  SET_SERVICE_LOADING,
  SET_SERVICE_SUCCESS,
  SET_CONNECT_SUCCESS,
} from "./actionTypes";

export const setServiceSuccess = (items) => {
  setServiceLoading();
  return {
    type: SET_SERVICE_SUCCESS,
    payload: items,
  };
};

export const setServiceLoading = () => ({
  type: SET_SERVICE_LOADING,
});

export const serviceFetchFailed = (error) => ({
  type: SET_SERVICE_FAIL,
  payload: error,
});

export const setConnectSuccess = (msg) => ({
  type: SET_CONNECT_SUCCESS,
  payload: msg,
});
