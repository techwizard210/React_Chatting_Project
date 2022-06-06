import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getProfile = createAsyncThunk('profilePage/profile/getProfile', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/user`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const profile = await response.data;
    return profile;
  } catch (error) {
    dispatch(
      showMessage({
        message: 'Get Profile error',
        variant: 'error',
      })
    );
    throw error;
  }
});

export const updateProfile = createAsyncThunk(
  'profilePage/profile/updateProfile',
  async (user, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.put(
        `/api/${orgId}/user`,
        { user },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const profile = await response.data;
      dispatch(
        showMessage({
          message: 'Update user success',
          variant: 'success',
        })
      );
      dispatch(getProfile());
      return profile;
    } catch (error) {
      dispatch(
        showMessage({
          message: 'Update Profile error',
          variant: 'error',
        })
      );
      throw error;
    }
  }
);

export const getOrganizations = createAsyncThunk(
  'profilePage/profile/getOrganizations',
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const response = await axios.get('/api/organization/list', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;
    return data;
  }
);

export const getTeam = createAsyncThunk('usersApp/users/getTeam', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/team/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const teams = await response.data;
    return teams;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Team List error', variant: 'error' }));
    throw error;
  }
});

const profileSlice = createSlice({
  name: 'profilePage/profile',
  initialState: {
    profileDialog: {
      type: 'edit',
      props: {
        open: false,
      },
    },
    data: null,
    team: null,
    organizations: [],
  },
  reducers: {
    openEditProfileDialog: (state, action) => {
      state.profileDialog = {
        props: {
          open: true,
        },
      };
    },
    closeEditProfileDialog: (state, action) => {
      state.profileDialog = {
        props: {
          open: false,
        },
      };
    },
  },
  extraReducers: {
    [getProfile.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [getTeam.fulfilled]: (state, action) => {
      const data = action.payload;
      state.team = data;
    },
    [getOrganizations.fulfilled]: (state, action) => {
      const data = action.payload;
      state.organizations = data;
    },
  },
});

export const { openEditProfileDialog, closeEditProfileDialog } = profileSlice.actions;

export default profileSlice.reducer;
