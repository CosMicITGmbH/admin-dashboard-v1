import {
  LOGIN_USER,
  START_LOADING,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  RESET_LOGIN_FLAG,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
};

const Login = (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        user: action.payload,
      };
      break;
    case LOGOUT_USER:
      state = { ...state, isUserLogout: false };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true };
      break;
    case API_ERROR:
      console.log("from reducer login error", action.payload);
      state = {
        ...state,
        error: action.payload,
        loading: false,
        isUserLogout: false,
      };
      break;
    case RESET_LOGIN_FLAG:
      state = {
        ...state,
        error: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Login;
