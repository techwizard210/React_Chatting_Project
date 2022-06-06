import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getKeywords = createAsyncThunk('replyApp/reply/getKeywords', async (replyId, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/reply/keyword`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        replyId,
      },
    });
    const keywordList = await response.data;
    return keywordList;
  } catch (error) {
    console.error('[replyApp/reply/getKeywords] ', error);
    return null;
  }
});

export const addKeyword = createAsyncThunk(
  'setting/customers/updateCustomer',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const response = await axios.post(
        `/api/${orgId}/reply/keyword`,
        {
          replyId: params.replyId,
          keyword: {
            keyword: params.keyword,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const keywordResult = await response.data;
      dispatch(getKeywords(replyId));
      return keywordResult;
    } catch (error) {
      console.error('[setting/customers/updateCustomer] ', error);
      return null;
    }
  }
);
export const removeKeyword = createAsyncThunk(
  'setting/customers/updateCustomer',
  async (keywordId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const response = await axios.delete(`/api/${orgId}/reply/keyword`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: keywordId,
        },
      });
      const keywordResult = await response.data;
      dispatch(getKeywords(replyId));
      return keywordResult;
    } catch (error) {
      console.error('[setting/customers/updateCustomer] ', error);
      return null;
    }
  }
);

const keywordAdapter = createEntityAdapter({});

export const { selectAll: selectKeyword, selectById: selectKeywordById } = keywordAdapter.getSelectors(
  (state) => state.replyApp.keyword
);

const keywordSlice = createSlice({
  name: 'replyApp/keyword',
  initialState: keywordAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getKeywords.fulfilled]: (state, action) => {
      keywordAdapter.setAll(state, action.payload);
    },
    // [addKeyword.fulfilled]: (state, action) => {
    //   keywordAdapter.addOne(state, action.payload);
    // },
    // [removeKeyword.fulfilled]: (state, action) => {
    //   keywordAdapter.removeOne(state, action.payload);
    // },
  },
});

export const { setKeywordSearchText } = keywordSlice.actions;

export default keywordSlice.reducer;
