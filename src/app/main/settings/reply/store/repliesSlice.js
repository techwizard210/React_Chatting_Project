import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getReplies = createAsyncThunk('replyApp/replies/getReplies', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/reply/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const reply = await response.data;
    return reply;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Reply list error', variant: 'error' }));
    return null;
  }
});

const repliesAdapter = createEntityAdapter({});

export const { selectAll: selectReplies, selectById: selectReplyById } = repliesAdapter.getSelectors(
  (state) => state.replyApp.replies
);

const repliesSlice = createSlice({
  name: 'replyApp/replies',
  initialState: repliesAdapter.getInitialState({
    searchText: '',
    confirmRemoveReplyDialog: {
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setRepliesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openConfirmRemoveReplyDialog: (state, action) => {
      state.confirmRemoveReplyDialog = {
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeConfirmRemoveReplyDialog: (state, action) => {
      state.confirmRemoveReplyDialog = {
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getReplies.fulfilled]: repliesAdapter.setAll,
  },
});

export const { closeConfirmRemoveReplyDialog, openConfirmRemoveReplyDialog, setRepliesSearchText } =
  repliesSlice.actions;

export default repliesSlice.reducer;
