import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getRewardHistory = createAsyncThunk(
  'loyaltyApp/rewardHistory/getRewardHistory',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/customer/rewardHistory/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const rewardHistory = await response.data;
      return rewardHistory;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Customer Reward History error', variant: 'error' }));
      throw error;
    }
  }
);

const rewardHistoryAdapter = createEntityAdapter({});

export const { selectAll: selectRewardHistory, selectById: selectRewardHistoryById } =
  rewardHistoryAdapter.getSelectors((state) => state.loyaltyApp.rewardHistory);

const rewardHistorySlice = createSlice({
  name: 'loyaltyApp/rewardHistory',
  initialState: rewardHistoryAdapter.getInitialState({
    searchText: '',
    routeParams: {},
  }),
  reducers: {
    setRewardHistorySearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getRewardHistory.fulfilled]: (state, action) => {
      rewardHistoryAdapter.setAll(state, action.payload);
      state.routeParams = {};
      state.searchText = '';
    },
  },
});

export const { setRewardHistorySearchText } = rewardHistorySlice.actions;

export default rewardHistorySlice.reducer;
