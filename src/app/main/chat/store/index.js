import { combineReducers } from '@reduxjs/toolkit';
import chats from './chatSlice';
import history from './historySlice';
import current from './currentSlice';
import customer from './customerSlice';
import sidebars from './sidebarsSlice';
import address from './addressSlice';
import reply from './replySlice';

const reducer = combineReducers({
  address,
  sidebars,
  reply,
  current,
  customer,
  chats,
  history,
});

export default reducer;
