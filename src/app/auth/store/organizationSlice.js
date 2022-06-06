import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import firebase from "firebase/compat/app";
import { showMessage } from "app/store/fuse/messageSlice";

export const getOrganization = createAsyncThunk(
  "auth/organization/getOrganization",
  async (organizationId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const response = await axios.get(`/api/organization`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: organizationId,
        },
      });
      const organization = await response.data;
      setOrganization(organization);
      return organization;
    } catch (error) {
      dispatch(
        showMessage({ message: "Get Organization error", variant: "error" })
      );
      throw error;
    }
  }
);

const initialState = {};

const organizationSlice = createSlice({
  name: "auth/organization",
  initialState,
  reducers: {
    clearOrganization: (state, action) => initialState,
    setOrganization: (state, action) => action.payload,
  },
});

export const { clearOrganization, setOrganization } = organizationSlice.actions;

export default organizationSlice.reducer;
