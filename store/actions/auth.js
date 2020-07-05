import { FIREBASE_API_KEY } from "react-native-dotenv";

export const SIGNUP = "SIGNUP";

export const signup = (email, password) => {
  console.log("FIREBASE KEY: ", FIREBASE_API_KEY);

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
      throw new Error("An error on a sign up process");
    }

    const resData = await response.json();
    console.log(resData);
    dispatch({ type: SIGNUP });
  };
};
