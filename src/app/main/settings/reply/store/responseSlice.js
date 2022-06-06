import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getResponses = createAsyncThunk(
  'replyApp/response/getResponseList',
  async (replyId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const result = await axios.get(`/api/${orgId}/reply/response`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          replyId,
        },
      });

      const responseResult = await result.data;
      responseResult.sort((a, b) => {
        return a.order - b.order;
      });
      dispatch(setResponse(responseResult));
      return responseResult;
    } catch (error) {
      console.error('[replyApp/response/getResponseList] ', error);
      dispatch(showMessage({ message: 'Get Response list error', variant: 'error' }));
      return null;
    }
  }
);

export const editResponse = createAsyncThunk(
  'replyApp/response/editResponse',
  async ({ index, response }, { dispatch, getState }) => {
    try {
      const { data } = getState().replyApp.response;
      if (data) {
        const newData = [...data];
        newData[index] = response;
        dispatch(setResponse(newData));
        return data;
      }
      return null;
    } catch (error) {
      console.error('[replyApp/response/editResponse] ', error);
      return null;
    }
  }
);

export const editResponseUnsaved = createAsyncThunk(
  'replyApp/response/editResponseUnsaved',
  async ({ index, response }, { dispatch, getState }) => {
    try {
      const { data } = getState().replyApp.response;
      if (data) {
        const newData = [...data];
        newData[index] = response;
        dispatch(setResponseUnsaved(newData));
        return data;
      }
      return null;
    } catch (error) {
      console.error('[replyApp/response/editResponseUnsaved] ', error);
      return null;
    }
  }
);

export const removeResponse = createAsyncThunk(
  'replyApp/response/removeResponse',
  async (responseId, { dispatch, getState }) => {
    console.log('removeResponse ', responseId);
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const result = await axios.delete(`/api/${orgId}/reply/response`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: responseId,
        },
      });
      const responseResult = await result.data;
      dispatch(getResponses(replyId));
      dispatch(showMessage({ message: 'Remove Response success', variant: 'success' }));
      return responseResult;
    } catch (error) {
      console.error('[replyApp/response/removeResponse] ', error);
      dispatch(showMessage({ message: 'Remove Response error', variant: 'error' }));
      return null;
    }
  }
);

export const addNewResponse = createAsyncThunk(
  'replyApp/response/addNewResponse',
  async (params, { dispatch, getState }) => {
    try {
      const { id: orgId } = getState().auth.organization.organization;
      const { id: userId } = getState().auth.user.foxData;
      console.log('Add New response');
      const { data } = getState().replyApp.response;
      if (data && data.length && data.length > 0) {
        const order = data.length + 1;
        return [
          ...data,
          {
            data: JSON.stringify({ text: '' }),
            channel: 'default',
            type: 'text',
            order,
            organization: { id: orgId },
            createdBy: { id: userId },
          },
        ];
      }
      return [
        {
          data: JSON.stringify({ text: '' }),
          channel: 'default',
          type: 'text',
          order: 1,
          organization: { id: orgId },
          createdBy: { id: userId },
        },
      ];
    } catch (error) {
      console.error('[replyApp/response/addNewResponse] ', error);
      dispatch(showMessage({ message: 'new Response error', variant: 'error' }));
      return [];
    }
  }
);

export const uploadImage = createAsyncThunk(
  'replyApp/response/uploadImage',
  async ({ formData, index }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const responses = getState().replyApp.response.data;

      // Upload File
      const fileUploadResponse = await axios.post(`/api/${orgId}/reply/response/uploads/${replyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const fileResponseResult = await fileUploadResponse.data;
      if (fileUploadResponse.status === 200) {
        console.log('Upload Result ', fileResponseResult);
        const { url, filename } = fileResponseResult;
        // wait file upload 3sec
        return setTimeout(async () => {
          if (responses && responses[index] && responses[index].type === 'image') {
            const newResponse = { ...responses[index] };
            newResponse.data = JSON.stringify({ image: { url, filename } });
            const newResponses = [...responses];
            newResponses[index] = newResponse;
            console.log('NEW RESPONSES ', newResponses);
            dispatch(setResponse(newResponses));
            return newResponse;
          }
          return null;
        }, 3000);
      }
      return null;
    } catch (error) {
      console.error('[replyApp/response/uploadImage] ', error);
      return null;
    }
  }
);

export const uploadResponseImage = createAsyncThunk(
  'replyApp/response/uploadResponseImage',
  async ({ formData }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const { id: replyId } = getState().replyApp.reply.data;
      const responses = getState().replyApp.response.data;

      // Upload File
      const fileUploadResponse = await axios.post(`/api/${orgId}/reply/response/uploads/${replyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const fileResponseResult = await fileUploadResponse.data;
      if (fileUploadResponse.status === 200) {
        console.log('Upload Result ', fileResponseResult);
        const { url, filename } = fileResponseResult;
        // wait file upload 3sec
        // return setTimeout(async () => {
        //   return fileResponseResult;
        // }, 3000);
        return fileResponseResult;
      }
      return null;
    } catch (error) {
      console.error('[replyApp/response/uploadResponseImage] ', error);
      return null;
    }
  }
);

const responseSlice = createSlice({
  name: 'replyApp/response',
  initialState: {
    current: null,
    data: null,
    dataUnsaved: null,
    uploadResult: null,
    confirmRemoveResponseDialog: {
      props: {
        open: false,
      },
      data: null,
    },
  },
  reducers: {
    setNewResponse: (state, action) => {
      state.current = [];
      state.data = [];
      state.dataUnsaved = [];
    },
    setCurrentResponse: (state, action) => {
      state.current = action.payload;
      state.data = action.payload;
      state.dataUnsaved = action.payload;
    },
    setResponse: (state, action) => {
      state.data = action.payload;
      state.dataUnsaved = action.payload;
    },
    setResponseUnsaved: (state, action) => {
      state.dataUnsaved = action.payload;
    },

    changeResponseOrder: (state, action) => {
      const { index, change } = action.payload;
      const newData = state.dataUnsaved;
      console.log('changeOrder index: ', index, ' change:', change);
      if (index < newData.length - 1 && change === 1) {
        const tmpOrder = newData[index].order;
        newData[index].order = newData[index + 1].order;
        newData[index + 1].order = tmpOrder;
      } else if (index > 0 && change === -1) {
        const tmpOrder = newData[index].order;
        newData[index].order = newData[index - 1].order;
        newData[index - 1].order = tmpOrder;
      }

      newData.sort((a, b) => {
        return a.order - b.order;
      });

      state.data = newData;
      state.dataUnsaved = newData;
    },

    removeResponseOrder: (state, action) => {
      const order = action.payload;
      console.log('Remove response order ', order);
      if (state.data) {
        let newResponse = state.data.filter((item) => {
          return item.order !== order;
        });
        newResponse = newResponse.map((item, index) => {
          item.order = index + 1;
          return item;
        });
        state.data = [...newResponse];
        // dispatch(removeResponse(template.id)).then(() => {
        //   getResponseList(reply.id);
        // });
        state.dataUnsaved = state.data;
      }
    },
  },
  extraReducers: {
    [addNewResponse.fulfilled]: (state, action) => {
      // state.current = action.payload;
      state.data = action.payload;
      state.dataUnsaved = action.payload;
    },

    [uploadResponseImage.fulfilled]: (state, action) => {
      state.uploadResult = action.payload;
    },
  },
});

export const {
  setResponse,
  setNewResponse,
  setCurrentResponse,
  changeResponseOrder,
  removeResponseOrder,
  setResponseUnsaved,
} = responseSlice.actions;

export default responseSlice.reducer;
