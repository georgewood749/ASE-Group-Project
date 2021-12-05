import {
  call,
  put,
  takeLatest,
  takeEvery,
  all,
  race,
  select,
  take,
  delay,
} from "redux-saga/effects";
import { login, signup } from "./api/auth";
import moment from "moment";
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_AUTH, TEST } from "./auth";
import {
  LOGIN_REQUESTED,
  SIGNUP_REQUESTED,
  LOGOUT_REQUESTED,
  TEST_REQUESTED,
} from "./auth.saga.js";
import { LOGIN_USER, LOGOUT_USER } from "./user";

function* loginUser({ payload }) {
  try {
    // main version
    const {
      user: { id, username },
      accessToken,
      refreshToken: { token, expirationDate },
    } = yield call(login, {
      username: payload.username,
      password: payload.password,
    });

    /*
      // old - second version - alternative endpoint
    const { id, username, accessToken, refreshToken, expirationDate } =
      yield call(signup, {
        username: payload.username,
        password: payload.password,
      });
    */

    yield put(
      LOGIN_SUCCESS({
        accessToken,
        refreshToken: token,
        expirationDate,
      })
    );

    yield put(
      LOGIN_USER({
        id,
        username,
      })
    );
  } catch (error) {
    const {
      data: { message },
    } = error.response;
    yield put(LOGIN_FAILURE({ message }));
  }
}

function* registerUser({ payload }) {
  try {
    // main version
    const {
      user: { id, username },
      accessToken,
      refreshToken: { token, expirationDate },
    } = yield call(login, {
      username: payload.username,
      password: payload.password,
    });

    /*
    old - second version - alternative endpoint
    const { id, username, accessToken, refreshToken, expirationDate } =
      yield call(signup, {
        username: payload.username,
        password: payload.password,
      });
    */

    // update auth slice
    yield put(
      LOGIN_SUCCESS({
        accessToken,
        refreshToken: token,
        expirationDate,
      })
    );

    // update user slice
    yield put(
      LOGIN_USER({
        id,
        username,
      })
    );
  } catch (error) {
    const {
      data: { message },
    } = error.response;
    yield put(LOGIN_FAILURE({ message }));
  }
}

function* test({ payload }) {
  yield put({
    type: "TEST",
  });

  yield put(TEST(payload));
}

function* watchTest() {
  yield takeEvery(TEST_REQUESTED, test);
}

function* watchUserLogin() {
  yield takeLatest(LOGIN_REQUESTED, loginUser);
}

function* watchUserRegister() {
  yield takeLatest(SIGNUP_REQUESTED, registerUser);
}

function* watchUserLogout() {
  console.log("launch application first time watcher running for user login");

  while (yield take(LOGIN_SUCCESS.type)) {
    console.log("user logged in");

    // const expirationDate = yield select((state) => state.auth.expirationDate);
    // const today = moment();
    // const value = moment(expirationDate).diff(today, 'x');

    const { start, stop } = yield race({
      start: delay(100000),
      stop: take(LOGOUT_REQUESTED.type),
    });

    if (start) {
      // we execution referesh token call.
      console.log("executing refresh tokens");

      yield put(LOGOUT_AUTH());
      yield put(LOGOUT_USER());
    } else if (stop) {
      console.log("user logging out");
      yield put(LOGOUT_AUTH());
      yield put(LOGOUT_USER());
    }
  }
}

export default function* rootSaga() {
  yield all([
    watchTest(),
    watchUserRegister(),
    watchUserLogin(),
    watchUserLogout(),
  ]);
}
