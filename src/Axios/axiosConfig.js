import axios from "axios";
import { getToken } from "../helpers/api_helper";
import { REACT_APP_API_MAIN_URL } from "../helpers/appContants";

const AxiosInstance = axios.create({
  baseURL: REACT_APP_API_MAIN_URL,
});

AxiosInstance.interceptors.response.use(
  (response) => {
    // console.log("response from axios AxiosInstance:", response);
    let message;
    if (response.data.statusCode === 500) {
      message = "Internal Server Error";
      return Promise.reject(message);
    }
    return response.data;
  },
  (error) => {
    // console.log("ERROR from axios interceptors:", error.response.status);
    let message;
    switch (error.response.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        window.location.href = "/login";
        break;
      case 404:
        message = "Sorry! The data you are looking for could not be found";
        break;
      case 403:
        message = "Sorry! You do not have access to this page";
        window.location.href = "/dashboard";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);

AxiosInstance.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + getToken();
  return config;
});

const customAxios = (dynamicBaseURL) => {
  const axiosInstance = axios.create({
    baseURL: dynamicBaseURL,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      // console.log("response from customAxios AxiosInstance:", response.data);
      let message;
      if (response.data.statusCode === 500) {
        message = "Internal Server Error";
        return Promise.reject(message);
      }
      return response.data;
    },
    (error) => {
      // console.log("ERROR from axios interceptors:", error);
      let message;
      switch (error.response.status) {
        case 500:
          message = "Internal Server Error";
          break;
        case 401:
          message = "Invalid credentials";
          window.location.href = "/login";
          break;
        case 404:
          message = "Sorry! The data you are looking for could not be found";
          break;
        case 403:
          message = "Sorry! You do not have access to this page";
          window.location.href = "/dashboard";
          break;
        default:
          message = error.message || error;
      }
      return Promise.reject(message);
    }
  );

  return axiosInstance;
};

export { AxiosInstance, customAxios };
