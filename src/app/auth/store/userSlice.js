/* eslint import/no-extraneous-dependencies: off */
import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import history from "@history";
import _ from "@lodash";
import {
  setInitialSettings,
  setDefaultSettings,
} from "app/store/fuse/settingsSlice";
import firebaseService from "app/services/firebaseService";
import { clearOrganization } from "./organizationSlice";

export const setUserDataFoxConnect =
  (foxUser, authUser, role) => async (dispatch, getState) => {
    const fuseDefaultSettings = getState().fuse.settings.defaults;

    const displayName = [];

    if (foxUser.display) {
      displayName.push(foxUser.display);
    } else {
      if (foxUser.firstname) {
        displayName.push(foxUser.firstname);
      }
      if (foxUser.lastname) {
        displayName.push(foxUser.lastname);
      }
    }

    const user = _.merge(
      {},
      {
        uid: authUser.uid,
        from: "firebase",
        role: [role],
        data: {
          displayName,
          picture: foxUser.picture,
          email: foxUser.email,
          settings: { ...fuseDefaultSettings },
        },
        foxData: {
          ...foxUser,
        },
      }
    );
    return dispatch(setUserData(user));
  };

export const createUserSettingsFoxConnect =
  (authUser) => async (dispatch, getState) => {
    const fuseDefaultSettings = getState().fuse.settings.defaults;
    const { currentUser } = firebase.auth();
    const idToken = await currentUser.getIdToken();

    // Get or Create FoxConnect User
    const response = await axios.get(`/api/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    const foxUser = response.data;

    // Update foxConnect User
    const updateFoxUserResult = await axios.put(
      `/api/user`,
      {
        user: {
          ...foxUser,
          display: authUser.display,
          firstname: authUser.firstname,
          lastname: authUser.lastname,
          email: authUser.email,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const displayName = [];
    if (updateFoxUserResult.data.display) {
      displayName.push(updateFoxUserResult.data.display);
    } else {
      if (updateFoxUserResult.data.firstname) {
        displayName.push(updateFoxUserResult.data.firstname);
      }
      if (updateFoxUserResult.data.lastname) {
        displayName.push(updateFoxUserResult.data.lastname);
      }
    }

    const user = _.merge(
      {},
      {
        uid: authUser.uid,
        from: "firebase",
        role: ["user"],
        data: {
          displayName,
          picture: updateFoxUserResult.data.picture,
          facebookToken: updateFoxUserResult.data.facebookToken,
          email: updateFoxUserResult.data.email,
          settings: { ...fuseDefaultSettings },
        },
        foxData: {
          ...foxUser,
        },
      }
    );
    return dispatch(setUserData(user));
  };

export const updateUserRoleFoxConnect =
  (organization) => async (dispatch, getState) => {
    // const oldUser = getState().auth.user;
    // const user = _.merge({}, oldUser, { role: [organization.role] });
    if (organization && organization.role) {
      return dispatch(setRole(organization.role));
    }

    return dispatch(setRole("user"));
  };

export const setUserData = (user) => async (dispatch, getState) => {
  //("/organization"); // for example 'apps/academy'
  history.pathname = "/organization";
  /*
    Set User Settings
     */
  dispatch(setDefaultSettings(user.data.settings));

  dispatch(setUser(user));
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, { data: { settings } });

  // dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const updateUserShortcuts =
  (shortcuts) => async (dispatch, getState) => {
    const { user } = getState().auth;
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    // dispatch(updateUserData(newUser));

    return dispatch(setUserData(newUser));
  };

export const logoutUser = (navigate) => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  localStorage.clear();
  dispatch(clearOrganization());

  navigate("/sign-in");

  firebaseService.signOut();

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

const initialState = {
  role: [], // guest
  data: {
    displayName: "guest",
    photoURL: "",
    email: "",
    shortcuts: [],
  },
};

const userSlice = createSlice({
  name: "auth/user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = [action.payload];
    },
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setRole, setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
