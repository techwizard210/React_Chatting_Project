import { combineReducers } from "@reduxjs/toolkit";
import fuse from "./fuse";
import i18n from "./i18nSlice";

import usersApp from "app/main/user/store";
import auth from "app/auth/store";

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    auth,
    usersApp,
    ...asyncReducers,
  });

  /*
	Reset the redux store when user logged out
	 */
  if (action.type === "user/userLoggedOut") {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
