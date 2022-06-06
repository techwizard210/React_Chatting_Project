import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import firebase from "firebase/compat/app";
// import { getFoxUser } from 'app/auth/store/foxSlice';
import { setUserData } from "app/auth/store/userSlice";
import _ from "@lodash";
import { showMessage } from "app/store/fuse/messageSlice";

export const getChannels = createAsyncThunk(
  "setting/channels/getChannels",
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const channelResponse = await axios.get(`/api/${orgId}/channel/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const channels = await channelResponse.data;
      if (channels && channels.length) {
        const lineChannels = channels.filter(
          (element) => element.channel === "line"
        );
        if (lineChannels) {
          dispatch(setLine(lineChannels));
        }

        const facebookChannels = channels.filter(
          (element) => element.channel === "facebook"
        );
        if (facebookChannels) {
          dispatch(setFacebook(facebookChannels));
        }
      }
      return channels;
    } catch (error) {
      console.error("[setting/channel/getChannels] ", error);
      return [];
    }
  }
);

export const addLineChannel = createAsyncThunk(
  "setting/channels/addChannel",
  async (lineChanel, { dispatch, getState }) => {
    const body = {
      channel: {
        channel: "line",
        line: {
          name: lineChanel.name,
          lineId: lineChanel.lineId,
          accessToken: lineChanel.accessToken,
          channelSecret: lineChanel.channelSecret,
        },
      },
    };
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(`/api/${orgId}/channel`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;

    dispatch(getChannels());

    dispatch(openEditLineChannelDialog(data));

    dispatch(
      showMessage({ message: "Create LINE channel", variant: "success" })
    );
    return data;
  }
);

export const updateLineChannel = createAsyncThunk(
  "setting/channels/updateChannel",
  async (channel, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/channel`,
      { channel },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;

    dispatch(getChannels());

    return data;
  }
);

export const removeLineChannel = createAsyncThunk(
  "setting/channels/removeChannel",
  async (lineChanel, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.delete(
      `/api/${orgId}/channel?channel=line&id=${lineChanel.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;

    dispatch(getChannels());

    return data;
  }
);

export const addFacebookChannel = createAsyncThunk(
  "setting/channels/addChannel",
  async (facebookChanel, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id } = getState().auth.user.foxData;
    const { id: orgId } = getState().auth.organization.organization;

    const body = {
      channel: "facebook",
      data: facebookChanel,
    };
    const response = await axios.post(`/api/${orgId}/channel`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;

    dispatch(getChannels());

    return data;
  }
);

export const removeFacebookChannel = createAsyncThunk(
  "setting/channels/removeChannel",
  async (channel, { dispatch, getState }) => {
    try {
      console.log("Remove facebook ", channel);
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const currentSubscribeResult = await axios.get(
        `https://graph.facebook.com/v12.0/${channel.facebook.pageId}/subscribed_apps`,
        {
          headers: {
            Authorization: `Bearer ${channel.facebook.accessToken}`,
          },
          params: {
            subscribed_fields: "messages",
          },
        }
      );
      if (
        currentSubscribeResult &&
        currentSubscribeResult.data &&
        currentSubscribeResult.data.data.length > 0
      ) {
        // need remove subscribe from facebook
        const fields = currentSubscribeResult.data.data[0].subscribed_fields;
        await axios.delete(
          `https://graph.facebook.com/v12.0/${channel.facebook.pageId}/subscribed_apps`,
          {
            headers: {
              Authorization: `Bearer ${channel.facebook.accessToken}`,
            },
            params: {
              subscribed_fields: fields,
            },
          }
        );
      }

      // console.log('facebook page ', subscribeResult);
      const response = await axios.delete(`/api/${orgId}/channel`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          channel: "facebook",
          id: channel.id,
        },
      });
      const data = await response.data;

      dispatch(getChannels());

      dispatch(
        showMessage({ message: "Remove Facebook channel", variant: "success" })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: "Remove Facebook channel error",
          variant: "error",
        })
      );
      throw error;
    }
  }
);

export const addFacebookUserTokenChannel = createAsyncThunk(
  "setting/channels/addFacebookUserTokenChannel",
  async (facebookToken, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id } = getState().auth.user.foxData;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/user`,
      { user: { id, facebookToken } },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;

    const oldUser = getState().auth.user;
    const user = _.merge({}, oldUser, {
      foxData: data,
    });
    dispatch(setUserData(user));

    return data;
  }
);
export const removeFacebookUserTokenChannel = createAsyncThunk(
  "setting/channels/removeFacebookUserTokenChannel",
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id } = getState().auth.user.foxData;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/user`,
      { user: { id, facebookToken: "" } },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    const oldUser = getState().auth.user;
    const user = _.merge({}, oldUser, {
      foxData: data,
    });
    dispatch(setUserData(user));

    return data;
  }
);

const channelsSlice = createSlice({
  name: "setting/channels",
  initialState: {
    line: null,
    facebook: null,
    channelDialog: {
      channel: null,
      type: "new",
      line: {
        props: {
          open: false,
        },
      },
      facebook: {
        props: {
          open: false,
        },
      },
      data: null,
    },
  },
  reducers: {
    setLine: (state, action) => {
      state.line = action.payload;
    },
    setFacebook: (state, action) => {
      state.facebook = action.payload;
    },

    openNewLineChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: "line",
        type: "new",
        line: {
          props: {
            open: true,
          },
        },
        facebook: {
          props: {
            open: false,
          },
        },
        data: null,
      };
    },
    closeNewLineChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: null,
        type: "new",
        line: {
          props: {
            open: false,
          },
        },
        facebook: {
          props: {
            open: false,
          },
        },
        data: null,
      };
    },

    openNewFacebookChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: "facebook",
        type: "new",
        line: {
          props: {
            open: false,
          },
        },
        facebook: {
          props: {
            open: true,
          },
        },
        data: null,
      };
    },
    closeNewFacebookChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: null,
        type: "new",
        line: {
          props: {
            open: false,
          },
        },
        facebook: {
          props: {
            open: false,
          },
        },
        data: null,
      };
    },
    openEditLineChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: "line",
        type: "edit",
        line: {
          props: {
            open: true,
          },
        },
        facebook: {
          props: {
            open: false,
          },
        },
        data: action.payload,
      };
    },
    closeEditLineChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: null,
        type: "edit",
        line: {
          props: {
            open: false,
          },
        },
        facebook: {
          props: {
            open: false,
          },
        },
        data: null,
      };
    },
    openEditFacebookChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: "facebook",
        type: "edit",
        line: {
          props: {
            open: false,
          },
        },
        facebook: {
          props: {
            open: true,
          },
        },
        data: action.payload,
      };
    },
    closeEditFacebookChannelDialog: (state, action) => {
      state.channelDialog = {
        channel: null,
        type: "edit",
        line: {
          props: {
            open: false,
          },
        },
        facebook: {
          props: {
            open: false,
          },
        },
        data: null,
      };
    },
  },
  extraReducers: {
    // [getChannels.fulfilled]: channelsAdapter.setAll,
  },
});
export const {
  setLine,
  setFacebook,
  openNewLineChannelDialog,
  closeNewLineChannelDialog,
  openEditLineChannelDialog,
  closeEditLineChannelDialog,
  openNewFacebookChannelDialog,
  closeNewFacebookChannelDialog,
  openEditFacebookChannelDialog,
  closeEditFacebookChannelDialog,
} = channelsSlice.actions;

export default channelsSlice.reducer;
