import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import FuseUtils from '@fuse/utils';
import history from '@history';
import _ from '@lodash';
import { showMessage } from 'app/store/fuse/messageSlice';
import reorder, { reorderQuoteMap } from './reorder';
import { getBoards, newBoard } from './boardsSlice';
import { updateCard, closeCardDialog } from './cardSlice';
import { clearSelect } from './boardCurrentSlice';

export const renameBoard = createAsyncThunk(
  'scrumboardApp/board/renameBoard',
  async ({ boardId, boardTitle }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/board/rename`,
      {
        boardId,
        boardTitle,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getBoard = createAsyncThunk('scrumboardApp/board/getBoard', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/board`,
      {
        params,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const board = await response.data;
    return board;
  } catch (error) {
    dispatch(
      showMessage({
        message: error.response.data,
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      })
    );
    history.push({
      pathname: '/apps/scrumboard/boards',
    });
    return null;
  }
});

export const newList = createAsyncThunk(
  'scrumboardApp/board/newList',
  async ({ board, listTitle, chatType, labelSelect }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/list/new`,
      {
        boardId: board.id,
        listTitle,
        chatType,
        labelSelect,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(getBoard({ boardId: board.id, boardUri: board.uri }));
    const data = await response.data;
    return data;
  }
);

export const newCard = createAsyncThunk(
  'scrumboardApp/board/newCard',
  async ({ boardId, listId, cardTitle }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/new`,
      {
        boardId,
        listId,
        cardTitle,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const renameList = createAsyncThunk(
  'scrumboardApp/board/renameList',
  async ({ boardId, listId, listTitle, chatType, chatLabels }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/list/rename`,
      {
        boardId,
        listId,
        listTitle,
        chatLabels,
        chatType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

// export const changeList = createAsyncThunk(
//   'scrumboardApp/board/changeList',
//   async ({ boardId, listId, chatLabels }, { dispatch, getState }) => {
//     const { token } = await firebase.auth().currentUser.getIdTokenResult();
//     if (!token) return null;
//     const { id: orgId } = getState().auth.organization.organization;
//     const response = await axios.post(
//       `/api/${orgId}/scrumboard/list/changeList`,
//       {
//         boardId,
//         listId,
//         chatLabels,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     const data = await response.data;
//     return data;
//   }
// );

export const removeList = createAsyncThunk(
  'scrumboardApp/board/removeList',
  async ({ boardId, listId }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/list/remove`,
      {
        boardId,
        listId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const changeBoardSettings = createAsyncThunk(
  'scrumboardApp/board/changeBoardSettings',
  async (newSettings, { dispatch, getState }) => {
    const { board } = getState().scrumboardApp;
    const settings = _.merge({}, board.settings, newSettings);
    console.log('changeBoardSettings >>>>>>>>', settings);
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/scrumboard/board/settings/update`,
      {
        boardId: board.id,
        settings,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const deleteBoard = createAsyncThunk(
  'scrumboardApp/board/deleteBoard',
  async (boardId, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/board/delete`,
      {
        boardId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(getBoards()).then(() => {
      history.push({
        pathname: '/apps/scrumboard/boards',
      });
    });

    const data = await response.data;
    return data;
  }
);

export const copyBoard = createAsyncThunk('scrumboardApp/board/copyBoard', async (board, { dispatch, getState }) => {
  const newBoardData = _.merge({}, board, {
    id: FuseUtils.generateGUID(),
    name: `${board.name} (Copied)`,
    uri: `${board.uri}-copied`,
  });

  dispatch(newBoard(newBoardData));

  return newBoardData;
});

export const removeCard = createAsyncThunk(
  'scrumboardApp/card/removeCard',
  async ({ boardId, cardId }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/removeCard`,
      {
        boardId,
        cardId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.data;

    dispatch(getBoard({ boardId }))
      .unwrap()
      .then((payload) => {
        dispatch(closeCardDialog());
        dispatch(clearSelect());
      });

    return cardId;
  }
);

export const reorderList = createAsyncThunk(
  'scrumboardApp/board/reorderList',
  async (result, { dispatch, getState }) => {
    const { board } = getState().scrumboardApp;
    const { lists } = board;

    const ordered = reorder(_.merge([], lists), result.source.index, result.destination.index);

    dispatch(listOrderInit(ordered));

    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;

    const response = await axios.post(
      `/api/${orgId}/scrumboard/list/order`,
      {
        boardId: board.id,
        lists: ordered,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const reorderCard = createAsyncThunk(
  'scrumboardApp/board/reorderCard',
  async ({ source, destination, draggableId }, { dispatch, getState }) => {
    const { board } = getState().scrumboardApp;
    const { lists } = board;

    const ordered = reorderQuoteMap(_.merge([], lists), source, destination);

    dispatch(cardOrderInit(ordered));

    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/order`,
      {
        boardId: board.id,
        lists: ordered,
        sourceCardId: draggableId,
        sourceListId: source.droppableId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  }
);

const boardSlice = createSlice({
  name: 'scrumboardApp/board',
  initialState: null,
  reducers: {
    resetBoard: (state, action) => null,
    addLabel: (state, action) => {
      state.labels = [...state.labels, action.payload];
    },
    listOrderInit: (state, action) => {
      state.lists = action.payload;
    },
    cardOrderInit: (state, action) => {
      state.lists = action.payload;
    },
  },
  extraReducers: {
    [getBoard.fulfilled]: (state, action) => action.payload,

    [reorderList.fulfilled]: (state, action) => {
      state.lists = action.payload;
    },
    [reorderCard.fulfilled]: (state, action) => action.payload,
    [newList.fulfilled]: (state, action) => {
      state.lists = action.payload;
    },
    [newCard.fulfilled]: (state, action) => action.payload,
    [renameList.fulfilled]: (state, action) => action.payload,
    [removeList.fulfilled]: (state, action) => {
      state.lists = _.reject(state.lists, { id: action.payload });
    },
    [changeBoardSettings.fulfilled]: (state, action) => {
      state.settings = action.payload;
    },
    [deleteBoard.fulfilled]: (state, action) => {
      state = {};
    },
    [renameBoard.fulfilled]: (state, action) => {
      state.name = action.payload;
    },
    [updateCard.fulfilled.type]: (state, action) => {
      state.cards = state.cards.map((_card) => {
        if (_card.id === action.payload.id) {
          return action.payload;
        }
        return _card;
      });
    },
    [removeCard.fulfilled]: (state, action) => {
      const cardId = action.payload;
      console.log('removeCard state>>>>', state);
      state.cards = _.reject(state.cards, { id: cardId });
      state.lists = state.lists.map((list) => {
        _.set(
          list,
          'idCards',
          _.reject(list.idCards, (id) => id === cardId)
        );
        return list;
      });
    },
  },
});

export const { resetBoard, addLabel, listOrderInit, cardOrderInit } = boardSlice.actions;

export default boardSlice.reducer;
