import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
// import { closeMobileChatsSidebar } from './sidebarsSlice';
import { setChatSelected, updateCurrent } from './boardCurrentSlice';

export const getChats = createAsyncThunk('scrumboardApp/chat/getChats', async (chatType, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    if (!getState().scrumboardApp) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const currentChatType = getState().scrumboardApp.boardCurrent.listType;
    const { filterLabel } = getState().scrumboardApp.boardCurrent;
    const type = currentChatType || chatType || 'assignee';
    const response = await axios.get(`/api/${orgId}/chat/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        type,
        // label: 'a',
        label: filterLabel.toString(),
      },
    });
    const result = await response.data;
    return result;
  } catch (error) {
    console.error('Get Chat list error ', error);
    dispatch(
      showMessage({
        message: 'Get Chat list error',
        variant: 'error',
      })
    );
    return [];
  }
});

export const getChat = createAsyncThunk(
  'scrumboardApp/chats/getChat',
  async ({ chatId, isMobile }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      if (!chatId) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/chat`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: chatId,
        },
      });
      const chat = await response.data;
      if (chat) {
        dispatch(setChatSelected(chat));
      }

      if (isMobile) {
        // dispatch(closeMobileChatsSidebar());
      }
      return chat;
    } catch (error) {
      console.error('Get Chat error ', error);
      dispatch(
        showMessage({
          message: 'Get Chat error',
          variant: 'error',
        })
      );
      return [];
    }
  }
);

export const getChatMessage = createAsyncThunk(
  'scrumboardApp/chats/getChatMessage',
  async ({ chatId, pNum, isMobile }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      if (!chatId) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/scrumboard/chat/getchatmessage`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: chatId,
          pNum,
        },
      });
      const chat = await response.data;
      console.log('🚀 ~ file: boardChatSlice.js ~ line 100 ~ chat', chat);

      if (chat) {
        dispatch(setChatSelected(chat));
      }

      if (isMobile) {
        // dispatch(closeMobileChatsSidebar());
      }
      return chat;
    } catch (error) {
      console.error('Get Chat error ', error);
      dispatch(
        showMessage({
          message: 'Get Chat error',
          variant: 'error',
        })
      );
      return [];
    }
  }
);

export const updateChat = createAsyncThunk('scrumboardApp/chats/updateChat', async (chat, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/chat`,
      { chat },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const chatResult = await response.data;
    dispatch(showMessage({ message: 'Chat Updated', variant: 'success' }));
    dispatch(getChat({ chatId: chat.id }));
    return chatResult;
  } catch (error) {
    console.error('Update ChatSs error ', error);
    dispatch(showMessage({ message: 'Update Chat error', variant: 'error' }));
    return null;
  }
});

export const updateChatOwner = createAsyncThunk(
  'scrumboardApp/chats/updateChat',
  async (chat, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.put(
        `/api/${orgId}/chat/owner`,
        { chat },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(showMessage({ message: 'Chat Owner Updated', variant: 'success' }));
      dispatch(getChat({ chatId: chat.id }));
      return chatResult;
    } catch (error) {
      console.error('Update ChatSs error ', error);
      dispatch(showMessage({ message: 'Update Chat owner error', variant: 'error' }));
      return null;
    }
  }
);

export const sendMessage = createAsyncThunk(
  'scrumboardApp/chats/sendMessage',
  async ({ messageText, chat, pNum }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.post(
        `/api/${orgId}/chat/sendMessage`,
        {
          chatId: chat.id,
          message: {
            data: JSON.stringify({ text: messageText }),
            type: 'text',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(getChatMessage({ chatId: chat.id, pNum: chat.pageNumber }));
      // dispatch(getChats());
      return chatResult;
    } catch (error) {
      console.error('[scrumboardApp/chats/sendMessage] ', error);
      dispatch(
        showMessage({
          message: 'Send message error',
          variant: 'error', // success error info warning null
        })
      );
      return null;
    }
  }
);

export const sendFileMessage = createAsyncThunk(
  'scrumboardApp/chats/sendFileMessage',
  async ({ formData, chat }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;

      // Upload File
      const fileUploadResponse = await axios.post(
        `/api/${orgId}/chat/uploads/${chat.channel.id}/${chat.customer.uid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fileResponseResult = await fileUploadResponse.data;

      // wait file upload 3sec
      return setTimeout(async () => {
        const response = await axios.post(
          `/api/${orgId}/chat/sendMessage`,

          {
            chatId: chat.id,
            message: {
              data: JSON.stringify({ filename: fileResponseResult.fileName }),
              type: 'image',
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sendImageMsgResponse = await response.data;

        dispatch(getChatMessage({ chatId: chat.id, pNum: chat.pageNumber }));
        // dispatch(getChats());
        return sendImageMsgResponse;
      }, 3000);
    } catch (error) {
      console.error('[scrumboardApp/chats/sendFileMessage] ', error);
      return null;
    }
  }
);

export const sendTeamChatMessage = createAsyncThunk(
  'scrumboardApp/chats/sendTeamChatMessage',
  async ({ messageText, chat }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.post(
        `/api/${orgId}/teamChat/sendMessage`,
        {
          chatId: chat.id,
          message: {
            data: JSON.stringify({ text: messageText }),
            type: 'text',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(getChatMessage({ chatId: chat.id, pNum: chat.pageNumber }));
      return chatResult;
    } catch (error) {
      console.error('TeamChat ', error);
      dispatch(
        showMessage({
          message: 'Send TeamChat message error',
          variant: 'error', // success error info warning null
        })
      );
      return null;
    }
  }
);

export const sendTeamChatFileMessage = createAsyncThunk(
  'scrumboardApp/chats/sendTeamChatFileMessage',
  async ({ formData, chat }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;

      // Upload File
      const fileUploadResponse = await axios.post(`/api/${orgId}/teamChat/uploads/${chat.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const fileResponseResult = await fileUploadResponse.data;

      // wait file upload 3sec
      return setTimeout(async () => {
        const response = await axios.post(
          `/api/${orgId}/teamChat/sendMessage`,

          {
            chatId: chat.id,
            message: {
              data: JSON.stringify({ filename: fileResponseResult.fileName }),
              type: 'image',
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sendImageMsgResponse = await response.data;

        dispatch(getChatMessage({ chatId: chat.id, pNum: chat.pageNumber }));
        // dispatch(getChats());
        return sendImageMsgResponse;
      }, 3000);
    } catch (error) {
      console.error('[scrumboardApp/chats/sendTeamChatFileMessage] ', error);
      return null;
    }
  }
);

export const markMentionRead = createAsyncThunk(
  'scrumboardApp/chats/markMentionRead',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.put(
        `/api/${orgId}/teamChat/read`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateCurrent());
      dispatch(getChats());
      return response;
    } catch (error) {
      console.error('TeamChat ', error);
      // dispatch(
      //   showMessage({
      //     message: 'TeamChat message error',
      //     variant: 'error', // success error info warning null
      //   })
      // );
      return null;
    }
  }
);

const boardChatsAdapter = createEntityAdapter({});

export const { selectAll: selectChats, selectById: selectChatsById } = boardChatsAdapter.getSelectors(
  (state) => state.scrumboardApp.boardChat
);

const boardChatSlice = createSlice({
  name: 'scrumboardApp/boardChat',
  initialState: boardChatsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setChatsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    clearChat: (state, action) =>
      boardChatsAdapter.getInitialState({
        searchText: '',
      }),
  },
  extraReducers: {
    [getChats.fulfilled]: (state, action) => {
      boardChatsAdapter.setAll(state, action.payload);
    },
  },
});

export const { setChatsSearchText, clearChat } = boardChatSlice.actions;

export default boardChatSlice.reducer;
