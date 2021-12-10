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
import moment from "moment";
import { login, signup, refreshToken } from "./api/auth";
import { getPricePaid } from "./api/map";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_AUTH,
  TEST,
  REFRESH_TOKEN,
} from "./auth";
import {
  LOGIN_REQUESTED,
  SIGNUP_REQUESTED,
  LOGOUT_REQUESTED,
  TEST_REQUESTED,
} from "./auth.saga.js";
import { LOGIN_USER, LOGOUT_USER } from "./user";
import { PRICE_PAID_REQUESTED } from "./price.saga";
import { UPDATE_PRICE_DATA, UPDATE_LOCATION } from "./map";

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
    } = yield call(signup, {
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

    const {
      accessToken,
      refreshToken: { token, expirationDate },
    } = yield call(login, {
      username: payload.username,
      password: payload.password,
    });

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

function* updatePricePaidData({ payload }) {
  try {
    const token = yield select((state) => state.auth.accessToken);
    const {
      currentLocation: { latitude, longitude },
      radius,
    } = payload;

    if (token) {
      const { propertyPricePaids } = yield call(getPricePaid, {
        latitude,
        longitude,
        token,
        radius,
      });

      yield put(UPDATE_PRICE_DATA(propertyPricePaids));
    }
  } catch (error) {
    // if (error.response.status === 400) {
    //   const currentRefreshToken = yield select(
    //     (state) => state.auth.refreshToken
    //   );

    //   const {
    //     accessToken,
    //     refreshToken: { token, expirationDate },
    //   } = yield call(refreshToken, currentRefreshToken);

    //   yield put(
    //     REFRESH_TOKEN({ accessToken, refreshToken: token, expirationDate })
    //   );

    //   console.log("refreshing tokens on updating price");

    //   yield put(
    //     PRICE_PAID_REQUESTED({
    //       latitude: payload.latitude,
    //       longitude: payload.longitude,
    //       radius: payload.radius
    //     })
    //   );
    // } else {
    //   console.log(error.message);
    // }
    console.log(error.message);
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

function* watchPricePaid() {
  yield takeLatest(PRICE_PAID_REQUESTED, updatePricePaidData);
}

function* watchUserLogout() {
  while (yield take(LOGIN_SUCCESS.type)) {
    console.log("timer started racing with user ");

    // const expirationDate = yield select((state) => state.auth.expirationDate);
    // const today = moment();
    // const value = moment(expirationDate).diff(today, 'x');
    const isAuthenticated = select((state) => state.auth.isAuthenticated);
    while (isAuthenticated) {
      const { start, stop } = yield race({
        start: delay(100000),
        stop: take(LOGOUT_REQUESTED.type),
      });

      if (start) {
        // we execution referesh token call.
        console.log("executing refresh tokens");
        // const currentRefreshToken = yield select(
        //   (state) => state.auth.refreshToken
        // );

        // const {
        //   accessToken,
        //   refreshToken: { token, expirationDate },
        // } = yield call(refreshToken, currentRefreshToken);

        // yield put(
        //   REFRESH_TOKEN({ accessToken, refreshToken: token, expirationDate })
        // );

        console.log("tokens refreshed");
      } else if (stop) {
        console.log("user logging out");
        yield put(LOGOUT_AUTH());
        yield put(LOGOUT_USER());
      }
    }
  }
}

export default function* rootSaga() {
  yield all([
    watchTest(),
    watchUserRegister(),
    watchUserLogin(),
    watchUserLogout(),
    watchPricePaid(),
  ]);
}
