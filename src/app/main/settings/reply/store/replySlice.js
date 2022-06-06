import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import firebase from "firebase/compat/app";
import { showMessage } from "app/store/fuse/messageSlice";

import { setCurrentResponse } from "./responseSlice";
import { getReplies } from "./repliesSlice";

export const getReply = createAsyncThunk(
  "replyApp/reply/getReply",
  async (replyId, { dispatch, getState }) => {
    try {
      console.log("replyApp/reply/getReply ", replyId);
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/reply?id=${replyId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const reply = await response.data;

      if (reply) {
        // console.log('[REPLY] ', reply);
        // dispatch(updateData(reply));
        dispatch(updateCurrentData(reply));
        if (
          reply.response &&
          reply.response.length &&
          reply.response.length > 0
        ) {
          // console.log('[RESPONSE] ', reply.response);

          const responses = [...reply.response];
          responses.sort((a, b) => {
            return a.order - b.order;
          });
          dispatch(setCurrentResponse(responses));
        } else {
          dispatch(setCurrentResponse([]));
        }
      } else {
        return null;
      }

      return reply;
    } catch (error) {
      console.log("[Get Reply] ", error);
      dispatch(showMessage({ message: "Get Reply error", variant: "error" }));
      return null;
    }
  }
);
export const updateReply = createAsyncThunk(
  "replyApp/reply/updateReply",
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { data: reply } = getState().replyApp.reply;
      const { dataUnsaved: response } = getState().replyApp.response;
      const res = await axios.put(
        `/api/${orgId}/reply`,
        {
          reply: {
            ...reply,
            response,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const replyResult = await res.data;
      dispatch(
        showMessage({
          message: "Update Reply success.",
          variant: "success", // success error info warning null
        })
      );
      // dispatch(getReply(reply.id));
      return replyResult;
    } catch (error) {
      console.error("[replyApp/reply/updateReply] ", error);
      dispatch(
        showMessage({
          message: "Update Reply error.",
          variant: "error", // success error info warning null
        })
      );
      return null;
    }
  }
);
export const removeReply = createAsyncThunk(
  "replyApp/reply/removeReply",
  async (replyId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;

      const response = await axios.delete(`/api/${orgId}/reply`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { id: replyId },
      });

      const replyResult = await response.data;

      dispatch(
        showMessage({
          message: "Delete Reply success.",
          variant: "success",
        })
      );
      dispatch(getReplies());
      // dispatch(getReply());
      return replyResult;
    } catch (error) {
      console.error("[replyApp/reply/removeReply] ", error);
      dispatch(
        showMessage({
          message: "Delete Reply error.",
          variant: "error",
        })
      );
      return null;
    }
  }
);

export const removeKeyword = createAsyncThunk(
  "setting/customers/updateCustomer",
  async (keywordId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const response = await axios.delete(`/api/${orgId}/reply/keyword`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: keywordId,
        },
      });
      const keywordResult = await response.data;
      dispatch(getReply(replyId));
      return keywordResult;
    } catch (error) {
      console.error("[setting/customers/updateCustomer] ", error);
      return null;
    }
  }
);
export const addKeyword = createAsyncThunk(
  "setting/customers/updateCustomer",
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const response = await axios.post(
        `/api/${orgId}/reply/keyword`,
        {
          replyId: params.replyId,
          keyword: {
            keyword: params.keyword,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const keywordResult = await response.data;
      dispatch(getReply(replyId));
      return keywordResult;
    } catch (error) {
      console.error("[setting/customers/updateCustomer] ", error);
      return null;
    }
  }
);

const replySlice = createSlice({
  name: "replyApp/reply",
  initialState: {
    current: null,
    data: null,
    confirmRemoveReplyDialog: {
      props: {
        open: false,
      },
      data: null,
    },
  },
  reducers: {
    addNewReply: (state, action) => {
      const template = {
        name: "",
        type: "auto",
        event: "response",
        status: "active",
        keyword: [],
        response: [],
      };
      state.data = template;
      state.current = template;
    },
    updateCurrentData: (state, action) => {
      console.log("[updateCurrentData] ", action.payload);
      state.current = action.payload;
      // state.data = action.payload;
    },
    updateData: (state, action) => {
      console.log("[updateData] ", action.payload);
      state.data = action.payload;
    },
    openConfirmRemoveReplyDialog: (state, action) => {
      state.confirmRemoveReplyDialog = {
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeConfirmRemoveReplyDialog: (state, action) => {
      state.confirmRemoveReplyDialog = {
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getReply.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {
  closeConfirmRemoveReplyDialog,
  openConfirmRemoveReplyDialog,
  updateData,
  updateCurrentData,
  addNewReply,
} = replySlice.actions;

export default replySlice.reducer;
