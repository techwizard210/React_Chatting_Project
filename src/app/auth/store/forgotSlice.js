import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const submitForgotWithFireBase =
  ({ email }) =>
  async (dispatch) => {
    if (!firebaseService.auth) {
      console.warn(
        "Firebase Service didn't initialize, check your configuration"
      );

      return () => false;
    }
    return firebaseService.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        dispatch(
          showMessage({
            message: 'Send Email success',
            autoHideDuration: 3000,
            variant: 'success',
          })
        );
        return dispatch(sendEmailSuccess());
      })
      .catch((error) => {
        const response = [];
        response.push({
          type: 'email',
          message: error.message,
        });
        showMessage({
          message: error.message,
          autoHideDuration: 3000,
          variant: 'error',
        });
        dispatch(showMessage({ message: error.message }));
        return dispatch(sendEmailError(response));
      });
  };

const initialState = {
  success: false,
  errors: [],
};

const forgotSlice = createSlice({
  name: 'auth/forgot',
  initialState,
  reducers: {
    sendEmailSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    sendEmailError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { sendEmailSuccess, sendEmailError } = forgotSlice.actions;

export default forgotSlice.reducer;
