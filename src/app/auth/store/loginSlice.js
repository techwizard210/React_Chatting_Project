import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import firebase from 'firebase/compat/app';

export const submitLoginWithFireBase =
  ({ email, password }) =>
  async (dispatch) => {
    if (!firebaseService.auth) {
      console.warn("Firebase Service didn't initialize, check your configuration");

      return () => false;
    }

    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebaseService.auth
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            return dispatch(loginSuccess());
          })
          .catch((error) => {
            const emailErrorCodes = [
              'auth/email-already-in-use',
              'auth/invalid-email',
              'auth/operation-not-allowed',
              'auth/user-not-found',
              'auth/user-disabled',
            ];
            const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];
            const response = [];

            if (emailErrorCodes.includes(error.code)) {
              response.push({
                type: 'email',
                message: error.message,
              });
            }

            if (passwordErrorCodes.includes(error.code)) {
              response.push({
                type: 'password',
                message: error.message,
              });
            }

            if (error.code === 'auth/invalid-api-key') {
              dispatch(showMessage({ message: error.message }));
            }

            return dispatch(loginError(response));
          });
      })
      .catch((error) => {
        // Handle Errors here.
        dispatch(showMessage({ message: error.message }));
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  };

export const signInWithSocialMedia = () => async (dispatch) => {
  if (!firebaseService.auth) {
    console.warn("Firebase Service didn't initialize, check your configuration");
    return () => false;
  }

  const fbProvider = firebaseService.Providers.facebook;
  fbProvider.addScope('email');

  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return firebaseService.auth
        .signInWithPopup(fbProvider)
        .then((result) => {
          return dispatch(loginSuccess());
        })
        .catch((error) => {
          console.error('Error: ', error);
          const emailErrorCodes = [
            'auth/email-already-in-use',
            'auth/invalid-email',
            'auth/operation-not-allowed',
            'auth/user-not-found',
            'auth/user-disabled',
          ];
          const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

          const otherErrorCodes = ['auth/account-exists-with-different-credential'];
          const response = [];

          if (emailErrorCodes.includes(error.code)) {
            response.push({
              type: 'email',
              message: error.message,
            });
          }

          if (passwordErrorCodes.includes(error.code)) {
            response.push({
              type: 'password',
              message: error.message,
            });
          }

          if (otherErrorCodes.includes(error.code)) {
            dispatch(
              showMessage({
                message: error.message,
                autoHideDuration: 10000, // ms
                anchorOrigin: {
                  vertical: 'top', // top bottom
                  horizontal: 'center', // left center right
                },
                variant: 'error', // success error info warning null
              })
            );
          }

          if (error.code === 'auth/invalid-api-key') {
            dispatch(showMessage({ message: error.message }));
          }

          return dispatch(loginError(response));
        });
    })
    .catch((error) => {
      // Handle Errors here.
      dispatch(showMessage({ message: error.message }));
      // var errorCode = error.code;
      // var errorMessage = error.message;
    });
};

const initialState = {
  success: false,
  errors: [],
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
