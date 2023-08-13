import {
  SET_SERVICE_FAIL,
  SET_SERVICE_LOADING,
  SET_SERVICE_SUCCESS,
  SET_CONNECT_SUCCESS,
} from "./actionTypes";

const initialState = {
  loading: false,
  services: [],
  error: false,
  success: false,
  msg: "",
};

const Services = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_LOADING:
      return {
        ...state,
        error: false,
        success: false,
        loading: true,
      };
    case SET_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        services: action.payload,
        success: true,
      };
    case SET_SERVICE_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        msg: action.payload,
      };
    case SET_CONNECT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        msg: action.payload,
      };

    default:
      return state;
  }
};

export default Services;
