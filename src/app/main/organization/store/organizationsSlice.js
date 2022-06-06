import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import firebase from "firebase/compat/app";
import { showMessage } from "app/store/fuse/messageSlice";

export const getOrganizations = createAsyncThunk(
  "organizationsApp/organizations/getOrganizations",
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const response = await axios.get("/api/organization/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.error(
        "[organizationsApp/organizations/getOrganizations] ",
        error
      );
      dispatch(
        showMessage({
          message: "Get Organization list error",
          variant: "error",
        })
      );
      return null;
    }
  }
);

export const addOrganization = createAsyncThunk(
  "organizationsApp/organizations/addOrganization",
  async (organization, { dispatch, getState }) => {
    delete organization.id;
    const { token } = await firebase.auth().currentUser.getIdTokenResult();

    if (!token) return null;
    const response = await axios.post(
      "/api/organization",
      { organization },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    dispatch(getOrganizations());
    return data;
  }
);

export const updateOrganization = createAsyncThunk(
  "organizationsApp/organizations/updateOrganization",
  async (organization, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const response = await axios.put(
      "/api/organization",
      { organization },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    dispatch(getOrganizations());
    return data;
  }
);

export const removeOrganizations = createAsyncThunk(
  "organizationsApp/organizations/removeOrganizations",
  async (contactIds, { dispatch, getState }) => {
    // await axios.post('/api/contacts-app/remove-contacts', { contactIds });

    // return contactIds;
    return null;
  }
);

const organizationsAdapter = createEntityAdapter({});

export const {
  selectAll: selectOrganizations,
  selectById: selectOrganizationsById,
} = organizationsAdapter.getSelectors(
  (state) => state.organizationsApp.organizations
);

const organizationsSlice = createSlice({
  name: "organizationsApp/organizations",
  initialState: organizationsAdapter.getInitialState({
    searchText: "",
    routeParams: {},
    organizationDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setOrganizationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    openNewOrganizationDialog: (state, action) => {
      state.organizationDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewOrganizationDialog: (state, action) => {
      state.organizationDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditOrganizationDialog: (state, action) => {
      state.organizationDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditOrganizationDialog: (state, action) => {
      state.organizationDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getOrganizations.fulfilled]: (state, action) => {
      organizationsAdapter.setAll(state, action.payload);
      state.routeParams = {};
      state.searchText = "";
    },
  },
});

export const {
  setOrganizationsSearchText,
  openNewOrganizationDialog,
  closeNewOrganizationDialog,
  openEditOrganizationDialog,
  closeEditOrganizationDialog,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
