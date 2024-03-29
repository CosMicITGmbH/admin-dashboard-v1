export const REACT_APP_API_REPORTING_URL =
  "https://85.215.218.183:50001/reporting/v1";

export const REACT_APP_API_MAIN_URL = "https://auth.csharpify.com";

export const groupTag = "GROUPS";
export const userInAGroupTag = "USER_INA_GROUP";
export const machineInAGroupTag = "MACHINE_INA_GROUP";
export const servicesTag = "SERVICES";
export const userTag = "USERS";
export const latestJobsTag = "LATEST_JOBS";
export const customerJobTag = "CUSTOMER_JOBS";
export const customerProductTag = "CUSTOMER_PRODUCT_JOBS";
export const productOrderTag = "PRODUCT_ORDER_JOBS";
//roles
export const userRole = "user";
export const adminRole = "admin";
export const managerRole = "manager";

/*****************  URLS *************/
export const LOGIN_API = "/auth/user/login";

//GROUPS
export const GROUPS_API = "/groups";

//USERS
export const USERS_API = "/users";
export const REGISTER_USER_API = "/auth/user/register";

//REGISTERING MACHINES
export const REGISTER_MACHINE_API = "/auth/machine/register";
export const REGISTER_SERVICE_API = "/auth/service/register";

//PROFILES
export const PROFILE_ID_API = "/profile?profileID=";
export const UPDATE_PROFILE_API = "/users/profile";

//machines
export const ALL_MACHINES_API = "machines?page=1&itemsPerPage=1000000";
export const CONNECT_MACHINE_SERVICE_API = "/services/connect/id";

//services
export const ALL_SERVICES_API = "/services";
export const GET_CONNECTED_SERVICE_API = "/services/machines/id";

//JOBS
export const CUSTOMER_JOBS = "jobs/customers";
