import { SET_MACHINE } from "./actionType";

export const setMachine = (machine) => ({
  type: SET_MACHINE,
  payload: machine,
});
