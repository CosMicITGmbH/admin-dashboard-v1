import {
  CLEAR_STATE,
  SET_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  UNSET_LOADING,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: false,
  success: false,
  message: null,
};

const Shared = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING: {
      console.log("ATTEMPT TO SET LOADING**********");
      return { ...state, loading: true };
    }

    case UNSET_LOADING:
      return { ...state, loading: false };
    case SET_SUCCESS:
      return { ...state, success: true, message: action.payload };
    case SET_ERROR:
      return { ...state, error: true, message: action.payload };
    case CLEAR_STATE:
      return { ...initialState };
    default:
      return { ...initialState };
  }
};

export default Shared;
