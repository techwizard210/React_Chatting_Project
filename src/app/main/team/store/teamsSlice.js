import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getTeams = createAsyncThunk('teamsApp/teams/getTeams', async (params, { dispatch, getState }) => {
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

export const addTeam = createAsyncThunk('teamsApp/teams/addTeam', async (team, { dispatch, getState }) => {
  try {
    delete team.id;
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/team`,
      { team },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const teams = await response.data;
    dispatch(getTeams());
    dispatch(showMessage({ message: 'Team added!', variant: 'success' }));
    return teams;
  } catch (error) {
    dispatch(showMessage({ message: 'Add Team error', variant: 'error' }));
    throw error;
  }
});

export const updateTeam = createAsyncThunk('teamsApp/teams/updateTeam', async (team, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/team`,
      { team },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const teams = await response.data;
    dispatch(getTeams());
    dispatch(showMessage({ message: 'Team updated!', variant: 'success' }));
    return teams;
  } catch (error) {
    dispatch(showMessage({ message: 'Update Team error', variant: 'error' }));
    throw error;
  }
});

export const removeTeam = createAsyncThunk('teamsApp/teams/removeTeam', async (teamId, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.delete(`/api/${orgId}/team`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: { id: teamId },
    });
    const teams = await response.data;
    dispatch(getTeams());
    dispatch(showMessage({ message: 'Team removed!', variant: 'success' }));
    return teams;
  } catch (error) {
    dispatch(showMessage({ message: 'Remove Team error', variant: 'error' }));
    throw error;
  }
});

const teamsAdapter = createEntityAdapter({});

export const { selectAll: selectTeams, selectById: selectTeamsById } = teamsAdapter.getSelectors(
  (state) => state.teamsApp.teams
);

const teamsSlice = createSlice({
  name: 'teamsApp/teams',
  initialState: teamsAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    teamDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setTeamsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewTeamDialog: (state, action) => {
      state.teamDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewTeamDialog: (state, action) => {
      state.teamDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditTeamDialog: (state, action) => {
      state.teamDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditTeamDialog: (state, action) => {
      state.teamDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getTeams.fulfilled]: (state, action) => {
      const data = action.payload;
      teamsAdapter.setAll(state, data);
      state.routeParams = {};
      state.searchText = '';
    },
    [addTeam.fulfilled]: teamsAdapter.addOne,
    [updateTeam.fulfilled]: teamsAdapter.upsertOne,
    [removeTeam.fulfilled]: (state, action) => teamsAdapter.removeOne(state, action.payload),
  },
});

export const { setTeamsSearchText, openNewTeamDialog, closeNewTeamDialog, openEditTeamDialog, closeEditTeamDialog } =
  teamsSlice.actions;

export default teamsSlice.reducer;
