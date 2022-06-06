import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import organization from './organizationSlice';
import forgot from './forgotSlice';
import register from './registerSlice';
import user from './userSlice';

const authReducers = combineReducers({
  user,
  forgot,
  login,
  organization,
  register,
});

export default authReducers;
