import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { EDIT_PROFILE } from "./actionTypes";
import { profileSuccess, profileError } from "./actions";
//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeProfile,
  postJwtProfile,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* editProfile({ payload: { user } }) {
  try {
    if (process.env.REACT_APP_API_URL) {
      // console.log("modfied user profile data", user);
      const response = yield call(postFakeProfile, user);
      // console.log("response from profile saga", response);
      yield put(
        profileSuccess({
          status: "Profile updated successfully !",
          data: user,
        })
      );
    }
  } catch (error) {
    // console.log("error while updating the profile", error);
    yield put(profileError(error));
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;
