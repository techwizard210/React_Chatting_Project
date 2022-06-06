import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const updateCurrent = createAsyncThunk(
  'chatApp/current/updateCurrent',
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const { selected, selectType } = getState().chatApp.current;

    if (selectType === 'chat') {
      const response = await axios.get(`/api/${orgId}/chat`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: selected.id,
        },
      });
      const chat = await response.data;
      if (chat) {
        dispatch(setChatSelected(chat));
      }
      return chat;
    }
    return null;
  }
);

const initialState = {
  selected: null,
  selectType: null,
  listType: 'active',
  filterLabel: [],
};

const currentSlice = createSlice({
  name: 'chatApp/current',
  initialState,
  reducers: {
    setListType: (state, action) => {
      state.listType = action.payload;
    },
    addSendingMessage: (state, action) => {
      if (state.selected && state.selected.message && state.selected.message.length) {
        const { message } = state.selected;
        message.push(action.payload);
        state.selected.message = message;
      }
    },
    setChatSelected: (state, action) => {
      state.selected = action.payload;
      state.selectType = 'chat';
    },
    setHistorySelected: (state, action) => {
      state.selected = action.payload;
      state.selectType = 'history';
    },
    setFilterLabel: (state, action) => {
      state.filterLabel = action.payload;
    },
    clearSelect: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setChatSelected, setHistorySelected, setListType, setFilterLabel, clearSelect, addSendingMessage } =
  currentSlice.actions;

export default currentSlice.reducer;
