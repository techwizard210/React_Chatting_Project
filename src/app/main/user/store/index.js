import { combineReducers } from '@reduxjs/toolkit';

import users from './usersSlice';

const reducer = combineReducers({
  users,
});

export default reducer;
