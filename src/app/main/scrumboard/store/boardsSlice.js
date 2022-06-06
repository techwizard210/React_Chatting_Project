import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import firebase from "firebase/compat/app";
import history from "@history";
import { updateNavigationItem } from "app/store/fuse/navigationSlice";
import BoardModel from "../model/BoardModel";

export const getBoards = createAsyncThunk(
  "scrumboardApp/boards/getBoards",
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/scrumboard/boards`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;

    if (data && data.length > 0) {
      dispatch(
        updateNavigationItem("scrumboard", {
          url: `/apps/boarddetail/${data[0].id}/${data[0].uri}`,
        })
      );
    }

    return data;
  }
);

export const newBoard = createAsyncThunk(
  "scrumboardApp/boards/newBoard",
  async (board, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/new`,
      {
        board: BoardModel(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;

    dispatch(
      updateNavigationItem("scrumboard", {
        url: `/apps/boarddetail/${data.id}/${data.uri}`,
      })
    );

    return data;
  }
);

const boardsAdapter = createEntityAdapter({});

export const { selectAll: selectBoards, selectById: selectBoardById } =
  boardsAdapter.getSelectors((state) => state.scrumboardApp.boards);

const boardsSlice = createSlice({
  name: "scrumboardApp/boards",
  initialState: boardsAdapter.getInitialState({}),
  reducers: {
    resetBoards: (state, action) => {},
  },
  extraReducers: {
    [getBoards.fulfilled]: boardsAdapter.setAll,
  },
});

export const { resetBoards } = boardsSlice.actions;

export default boardsSlice.reducer;
