import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getOrganization = createAsyncThunk(
  'generalPage/getOrganization',
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const { id: orgId } = getState().auth.organization.organization;
    if (!token) return null;
    const response = await axios.get('/api/organization', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: orgId,
      },
    });
    const data = await response.data;
    dispatch(setOrganization(data));
    return data;
  }
);

export const getChannels = createAsyncThunk('generalPage/getOrganization', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const channelResponse = await axios.get(`/api/${orgId}/channel/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const channels = await channelResponse.data;
    if (channels && channels.length) {
      const lineChannels = channels.filter((element) => element.channel === 'line');
      if (lineChannels) {
        console.log('### ', lineChannels);
        dispatch(setLine(lineChannels));
      }
    }
    return channels;
  } catch (error) {
    console.error('[generalPage/getOrganization] ', error);
    return [];
  }
});

export const updateOrganization = createAsyncThunk(
  'generalPage/updateOrganization',
  async (organization, { dispatch, getState }) => {
    try {
      console.log('updateOrganization ', organization);
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const response = await axios.put(
        '/api/organization',
        { organization },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      dispatch(
        showMessage({
          message: 'Update success',
          variant: 'success',
        })
      );
      dispatch(getOrganization());
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: 'Update  error',
          variant: 'error',
        })
      );
      throw error;
    }
  }
);

const generalSlice = createSlice({
  name: 'generalPage/general',
  initialState: {
    line: null,
    organization: null,
  },
  reducers: {
    setLine: (state, action) => {
      state.line = action.payload;
    },
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
  },
  extraReducers: {},
});

export const { setLine, setOrganization } = generalSlice.actions;

export default generalSlice.reducer;
