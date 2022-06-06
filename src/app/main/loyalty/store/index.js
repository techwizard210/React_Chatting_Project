import { combineReducers } from '@reduxjs/toolkit';

import rewards from './rewardsSlice';
import rewardHistory from './rewardHistorySlice';
import pointHistory from './pointHistorySlice';

const reducer = combineReducers({
  pointHistory,
  rewards,
  rewardHistory,
});

export default reducer;
