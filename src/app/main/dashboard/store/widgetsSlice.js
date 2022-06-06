import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getSummary = createAsyncThunk(
  'DashboardApp/widgets/getSummary',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const dashboardData = await response.data;
      const data = [
        {
          id: 'allChat',
          title: 'All Chat',
          data: {
            name: 'Chat',
            count: dashboardData.allChat,
          },
          detail: '',
        },
        {
          id: 'openChat',
          title: 'Open Chat',
          data: {
            name: 'Chat',
            count: dashboardData.openChat,
          },
          detail: '',
        },
        {
          id: 'messageToday',
          title: 'Message Today',
          data: {
            name: 'Message',
            count: dashboardData.todayMessage,
          },
          detail: '',
        },
        {
          id: 'allMessage',
          title: 'ALl Message',
          data: {
            name: 'Message',
            count: dashboardData.allMessage,
          },
          detail: '',
        },
        {
          id: 'allUser',
          title: 'All User',
          data: {
            name: 'User',
            count: dashboardData.allUser,
          },
          detail: '',
        },
      ];
      return data;
    } catch (error) {
      console.error('GetSummary ', error);
      dispatch(showMessage({ message: 'Get Dashboard data error', variant: 'error' }));
      throw error;
    }
  }
);

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgetsEntities, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
  (state) => state.DashboardApp.widgets
);

const widgetsSlice = createSlice({
  name: 'DashboardApp/widgets',
  initialState: widgetsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getSummary.fulfilled]: (state, action) => {
      widgetsAdapter.setAll(state, action.payload);
    },
  },
});

export default widgetsSlice.reducer;
