import { FIREBASE_API_KEY } from "react-native-dotenv";
import { AsyncStorage } from "react-native";

// action identifiers
// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AUTO_LOGIN = "SET_DID_TRY_AUTO_LOGIN";

let timer;

export const setDidTryAutoLogin = () => {
  return { type: SET_DID_TRY_AUTO_LOGIN };
};

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();

      let message = "Something went wrong!";
      const errorId = errorResData.error.message;
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    // console.log(resData);
    // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn * 1000)
    );

    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      // console.log(errorResData);

      let message = "Something went wrong!";
      const errorId = errorResData.error.message;
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "Invalid password!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    // console.log(resData);
    // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    // const currentTimestamp = new Date().getTime();
    // const expiresIn = parseInt(resData.expiresIn * 1000); // *1000 to convert to milliseconds
    // const expirationDate = new Date(currentTimestamp + expiresIn);

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn * 1000)
    );

    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();

  // remove userData from a local storage
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    // clearTimeout() is a built-in JS function
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

// save data to local storage
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
