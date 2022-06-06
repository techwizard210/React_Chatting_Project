import { combineReducers } from '@reduxjs/toolkit';

import profile from './profileSlice';

const reducer = combineReducers({
  profile,
});

export default reducer;
