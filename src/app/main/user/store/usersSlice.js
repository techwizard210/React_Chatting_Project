import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setUserData } from 'app/auth/store/userSlice';

import _ from '@lodash';

// Get User list from Backend
export const getUsers = createAsyncThunk('usersApp/users/getUsers', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/user/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const users = await response.data;
    return users;
  } catch (error) {
    dispatch(showMessage({ message: 'Get User List error', variant: 'error' }));
    throw error;
  }
});

// Get Team List on this organization for create select option when edit user
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
    const team = await response.data;
    return team;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Team list error', variant: 'error' }));
    throw error;
  }
});

// Add temporary User on this organization
export const addUser = createAsyncThunk('usersApp/users/addUser', async (email, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/user/organization`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const users = await response.data;
    dispatch(
      showMessage({
        message: 'Create user success',
        variant: 'success',
      })
    );

    dispatch(getUsers());

    return users;
  } catch (error) {
    console.error('[usersApp/users/addUser] ', error);
    dispatch(
      showMessage({
        message: 'Add user error',
        variant: 'error',
      })
    );
    throw error;
  }
});

// Update User information
export const updateUser = createAsyncThunk('usersApp/users/updateUser', async (data, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { email } = getState().auth.user.data;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(`/api/${orgId}/user`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const userResult = await response.data;
    dispatch(
      showMessage({
        message: 'Update user success',
        variant: 'success',
      })
    );
    dispatch(getUsers());

    // Update current User
    const oldUser = getState().auth.user;
    const displayName = [];
    if (userResult.display) {
      displayName.push(userResult.display);
    } else {
      if (userResult.firstname) {
        displayName.push(userResult.firstname);
      }
      if (userResult.lastname) {
        displayName.push(userResult.lastname);
      }
    }
    if (userResult.email === email) {
      const user = _.merge(
        {},
        {
          role: [data.role],
          data: {
            ...oldUser.data,
            displayName,
            picture: userResult.picture,
            email: userResult.email,
          },
          foxData: {
            ...userResult,
          },
        }
      );
      return dispatch(setUserData(user));
    }
    return userResult;
  } catch (error) {
    dispatch(
      showMessage({
        message: 'Update user error',
        variant: 'error',
      })
    );
    throw error;
  }
});

// Remove user from this organization (no delete)
export const removeUser = createAsyncThunk('usersApp/users/removeUser', async (user, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.delete(`/api/${orgId}/user/organization`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: { id: user.user.id },
    });
    const userResult = await response.data;
    dispatch(
      showMessage({
        message: 'Remove user success',
        variant: 'success',
      })
    );
    dispatch(getUsers());
    return userResult;
  } catch (error) {
    console.error('[usersApp/users/removeUser] ', error);
    dispatch(
      showMessage({
        message: 'Remove user error',
        variant: 'error',
      })
    );
    throw error;
  }
});

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUsersById } = usersAdapter.getSelectors(
  (state) => state.usersApp.users
);

const usersSlice = createSlice({
  name: 'usersApp/users',
  initialState: usersAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    userDialog: {
      props: {
        open: false,
      },
      data: null,
    },
    addUserDialog: {
      props: {
        open: false,
      },
    },
    team: null,
  }),
  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openEditUserDialog: (state, action) => {
      state.userDialog = {
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditUserDialog: (state, action) => {
      state.userDialog = {
        props: {
          open: false,
        },
        data: null,
      };
    },
    openAddUserDialog: (state, action) => {
      state.addUserDialog = {
        props: {
          open: true,
        },
      };
    },
    closeAddUserDialog: (state, action) => {
      state.addUserDialog = {
        props: {
          open: false,
        },
      };
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      usersAdapter.setAll(state, action.payload);
      state.routeParams = {};
      state.searchText = '';
    },
    [getTeam.fulfilled]: (state, action) => {
      const data = action.payload;
      state.team = data;
    },
    // [addUser.fulfilled]: usersAdapter.addOne,
    // [updateUser.fulfilled]: usersAdapter.upsertOne,
    // [removeUser.fulfilled]: (state, action) => usersAdapter.removeOne(state, action.payload),
  },
});

export const { setUsersSearchText, openEditUserDialog, closeEditUserDialog, openAddUserDialog, closeAddUserDialog } =
  usersSlice.actions;

export default usersSlice.reducer;
