import { combineReducers } from '@reduxjs/toolkit';

import teams from './teamsSlice';

const reducer = combineReducers({
  teams,
});

export default reducer;
