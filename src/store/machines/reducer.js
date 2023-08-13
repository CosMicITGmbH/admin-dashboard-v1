import { SET_MACHINE } from "./actionType";

const initialState = {
  machineName: {
    name: "",
    endPoint: "",
  },
};

const Machine = (state = initialState, action) => {
  switch (action.type) {
    case SET_MACHINE:
      return {
        ...state,
        machineName: action.payload,
      };
    default:
      return state;
  }
};

export default Machine;
