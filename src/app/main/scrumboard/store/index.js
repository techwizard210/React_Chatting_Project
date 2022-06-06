import { combineReducers } from '@reduxjs/toolkit';
import board from './boardSlice';
import boards from './boardsSlice';
import card from './cardSlice';
import boardChat from './boardChatSlice';
import boardCurrent from './boardCurrentSlice';
import reply from './replySlice';
import sidebars from './sidebarsSlice';
import history from './historySlice';
import customer from './customerSlice';

const scrumboardAppReducers = combineReducers({
  boards,
  board,
  card,
  boardChat,
  boardCurrent,
  reply,
  sidebars,
  history,
  customer,
});

export default scrumboardAppReducers;
