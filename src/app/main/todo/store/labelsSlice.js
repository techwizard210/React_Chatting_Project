import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getLabels = createAsyncThunk('todoApp/labels/getLabels', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/todo/label/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const labels = await response.data;
    return labels;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Todo label List error', variant: 'error' }));
    throw error;
  }
});

export const getLabel = createAsyncThunk('todoApp/labels/getLabels', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/todo/label`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const labels = await response.data;
    return labels;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Todo label error', variant: 'error' }));
    throw error;
  }
});

export const addLabel = createAsyncThunk('todoApp/labels/addLabel', async (labels, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/todo/label`,
      { labels },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    dispatch(getLabels());
    dispatch(showMessage({ message: 'Todo label added!', variant: 'success' }));
    return data;
  } catch (error) {
    dispatch(showMessage({ message: 'Add Todo label error', variant: 'error' }));
    throw error;
  }
});

const labelsAdapter = createEntityAdapter({});

export const {
  selectAll: selectLabels,
  selectEntities: selectLabelsEntities,
  selectById: selectLabelById,
} = labelsAdapter.getSelectors((state) => state.todoApp.labels);

const labelsSlice = createSlice({
  name: 'todoApp/labels',
  initialState: labelsAdapter.getInitialState(null),
  reducers: {},
  extraReducers: {
    [getLabels.fulfilled]: labelsAdapter.setAll,
    [addLabel.fulfilled]: labelsAdapter.addOne,
  },
});

export default labelsSlice.reducer;
