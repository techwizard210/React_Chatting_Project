import { combineReducers } from '@reduxjs/toolkit';

import organizations from './organizationsSlice';

const reducer = combineReducers({
  organizations,
});

export default reducer;
