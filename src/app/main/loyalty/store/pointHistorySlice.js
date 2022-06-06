import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getPointHistory = createAsyncThunk(
  'loyaltyApp/pointHistory/getPointHistory',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/customer/pointHistory/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const pointHistory = await response.data;
      return pointHistory;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Customer Point History error', variant: 'error' }));
      throw error;
    }
  }
);

const pointHistoryAdapter = createEntityAdapter({});

export const { selectAll: selectPointHistory, selectById: selectPointHistoryById } = pointHistoryAdapter.getSelectors(
  (state) => state.loyaltyApp.pointHistory
);

const pointHistorySlice = createSlice({
  name: 'loyaltyApp/pointHistory',
  initialState: pointHistoryAdapter.getInitialState({
    searchText: '',
    routeParams: {},
  }),
  reducers: {
    setPointHistorySearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getPointHistory.fulfilled]: (state, action) => {
      pointHistoryAdapter.setAll(state, action.payload);
      state.routeParams = {};
      state.searchText = '';
    },
  },
});

export const { setPointHistorySearchText } = pointHistorySlice.actions;

export default pointHistorySlice.reducer;
