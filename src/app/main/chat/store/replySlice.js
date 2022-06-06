import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getChat, getChats } from './chatSlice';

export const getReplies = createAsyncThunk('chatApp/reply/getReplies', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/reply/list/quick`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const quickReply = await response.data;
    // Filter reply no response
    const filterReply = await quickReply.filter((reply) => reply.response && reply.response.length > 0);
    return filterReply;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Quick Reply error', variant: 'error' }));
    return null;
  }
});

export const sendReply = createAsyncThunk(
  'chatApp/reply/sendReply',
  async ({ reply, chat }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;

      const response = await axios.post(
        `/api/${orgId}/chat/sendReplyMessage`,
        {
          chatId: chat.id,
          replyId: reply.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.data;

      dispatch(getChat({ chatId: chat.id }));
      dispatch(getChats());
      return result;
    } catch (error) {
      dispatch(showMessage({ message: 'Send Quick Reply error', variant: 'error' }));
      return {};
    }
  }
);

const replySlice = createSlice({
  name: 'chatApp/reply',
  initialState: null,
  reducers: {},
  extraReducers: {
    [getReplies.fulfilled]: (state, action) => action.payload,
  },
});

export default replySlice.reducer;
