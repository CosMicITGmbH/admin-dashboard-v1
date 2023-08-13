import { combineReducers } from "redux";

// Front
import Layout from "./layouts/reducer";

// Authentication
import ForgetPassword from "./auth/forgetpwd/reducer";
import Login from "./auth/login/reducer";
import Profile from "./auth/profile/reducer";
import Account from "./auth/register/reducer";

//Calendar
//Chat
//Ecommerce

//Project

// Tasks
//Form advanced

//Crypto

//TicketsList
//Crm

//Invoice

//Mailbox

//Machine
import Machine from "./machines/reducer";

//service
import Services from "./services/reducer";
//common
import Shared from "./shared/reducer";

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  Shared,
  Machine,
  Services,
  // Calendar,
  // chat,
  // Projects,
  // Ecommerce,
  // Tasks,
  // changeNumber,
  // Crypto,
  // Tickets,
  // Crm,
  // Invoice,
  // Mailbox,
  // public
});

export default rootReducer;
