import { GET_MACHINE, SET_MACHINE } from "./actionType";

export const getmachineList = () => ({
  type: GET_MACHINE,
});

export const setMachine = (machine) => ({
  type: SET_MACHINE,
  payload: machine,
});
