import { combineReducers } from '@reduxjs/toolkit';

import customers from './customersSlice';
import address from './addressSlice';

const reducer = combineReducers({
  address,
  customers,
});

export default reducer;
