import { AxiosInstance } from "../../../Axios/axiosConfig";
import { GROUPS_API } from "../../../helpers/appContants";

const getUserDatabyId = async (groupId, expression) => {
  const resp = await AxiosInstance.post(`${GROUPS_API}/${groupId}/users`, {
    expression: expression,
  });
  return resp;
};

const getMachineDatabyId = async (groupId, expression) => {
  const resp = await AxiosInstance.post(`${GROUPS_API}/${groupId}/machines`, {
    expression: expression,
  });
  return resp;
};

export { getUserDatabyId, getMachineDatabyId };
