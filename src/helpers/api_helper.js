import axios from "axios";
import { api } from "../config";
import { AxiosInstance } from "../Axios/axiosConfig";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

const getToken = () => {
  const isLoggedIn = getLoggedinUser();
  if (!isLoggedIn) return null;
  return JSON.parse(sessionStorage.getItem("authUser"))?.token;
};

const getUserRole = () => {
  return JSON.parse(sessionStorage.getItem("authUser"))?.data?.role;
};

const machineEndPoint = () => {
  return JSON.parse(sessionStorage.getItem("selectedMachine"))?.endPoint;
};

const getSelectedMachine = () => {
  return sessionStorage.getItem("selectedMachine") || "";
};
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

const token = getToken();

if (token) {
  setAuthorization(token);
}

const fetchRoles = async () => {
  try {
    const response = await AxiosInstance.post("/roles/applicable", {});
    console.log("roles response:", response);
    const options = response.items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    return [{ options }];
  } catch (error) {
    console.log("Error while fetching roles:", error);
    // Handle error, e.g., show a message to the user
  }
};

// // intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    console.log("ERROR from axios interceptors:", error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };
  /**
   * Updates data with post method
   */
  updateWithPost = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

export {
  APIClient,
  setAuthorization,
  getLoggedinUser,
  getUserRole,
  getToken,
  machineEndPoint,
  getSelectedMachine,
  fetchRoles,
};
