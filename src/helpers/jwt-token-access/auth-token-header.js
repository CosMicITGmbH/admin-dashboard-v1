import { getLoggedinUser } from "../api_helper";

export default function authHeader() {
  const obj = getLoggedinUser();

  if (obj && obj.token) {
    return { Authorization: obj.token };
  } else {
    return {};
  }
}
