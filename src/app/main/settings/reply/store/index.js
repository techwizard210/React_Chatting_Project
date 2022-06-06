import { combineReducers } from '@reduxjs/toolkit';
import replies from './repliesSlice';
import reply from './replySlice';
import keyword from './keywordSlice';
import response from './responseSlice';

const repliesReducers = combineReducers({
  replies,
  reply,
  keyword,
  response,
});

export default repliesReducers;
