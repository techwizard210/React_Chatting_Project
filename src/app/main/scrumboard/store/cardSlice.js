import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const updateCard = createAsyncThunk(
  'scrumboardApp/card/updateCard',
  async ({ boardId, listId, card }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/scrumboard/card/update`,
      {
        boardId,
        card,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.data;
    const result = { ...data, boardId, listId };
    // dispatch(
    //   showMessage({
    //     message: 'Card Saved',
    //     autoHideDuration: 2000,
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right',
    //     },
    //   })
    // );

    return result;
  }
);

// export const removeCard = createAsyncThunk(
//   'scrumboardApp/card/removeCard',
//   async ({ boardId, cardId }, { dispatch, getState }) => {
//     const { token } = await firebase.auth().currentUser.getIdTokenResult();
//     if (!token) return null;
//     const { id: orgId } = getState().auth.organization.organization;
//     const response = await axios.post(
//       '/api/scrumboard-app/card/remove',
//       {
//         boardId,
//         cardId,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await response.data;

//     dispatch(closeCardDialog());
//     return data;
//   }
// );

export const newComment = createAsyncThunk(
  'scrumboardApp/card/newComment',
  async ({ boardId, listId, cardId, cardComment }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/newComment`,
      {
        boardId,
        listId,
        cardId,
        cardComment,
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

export const newChecklist = createAsyncThunk(
  'scrumboardApp/card/newChecklist',
  async ({ cardId, listName }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/newChecklist`,
      {
        cardId,
        listName,
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

export const newChecklistItem = createAsyncThunk(
  'scrumboardApp/card/newChecklistItem',
  async ({ checklistId, itemName }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/newChecklistItem`,
      {
        checklistId,
        itemName,
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

export const changelistItemStatus = createAsyncThunk(
  'scrumboardApp/card/changelistItemStatus',
  async ({ itemId, checkeStatus }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/changelistItemStatus`,
      {
        itemId,
        checkeStatus,
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

export const deleteChecklistItem = createAsyncThunk(
  'scrumboardApp/card/deleteChecklistItem',
  async ({ itemId }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/deleteChecklistItem`,
      {
        itemId,
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

export const updateChecklistItem = createAsyncThunk(
  'scrumboardApp/card/updateChecklistItem',
  async ({ item, checklistId }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/updateChecklistItem`,
      {
        item,
        checklistId,
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

export const updateChecklist = createAsyncThunk(
  'scrumboardApp/card/updateChecklist',
  async ({ checklist, listName }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/updateChecklist`,
      {
        checklist,
        listName,
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

export const removeChecklist = createAsyncThunk(
  'scrumboardApp/card/removeChecklist',
  async ({ checklistId }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/removeChecklist`,
      {
        checklistId,
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

export const removeAttachmentFile = createAsyncThunk(
  'scrumboardApp/card/removeAttachmentFile',
  async ({ item }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/scrumboard/card/removeAttachmentFile`,
      {
        item,
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

export const sendFileAttachment = createAsyncThunk(
  'scrumboardApp/card/sendFileAttachment',
  async ({ formData, card }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(`/api/${orgId}/scrumboard/card/sendFileAttachment/${card.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;
    // return setTimeout(async () => {
    return data;
    // }, 3000);
  }
);

export const addCardLabel = createAsyncThunk(
  'scrumboardApp/card/addCardLabel',
  async ({ cardLabels }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.post(
        `/api/${orgId}/scrumboard/card/addCardLabel`,
        { cardLabels },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      // dispatch(getLabels());
      // dispatch(showMessage({ message: 'Todo label added!', variant: 'success' }));
      return data;
    } catch (error) {
      dispatch(showMessage({ message: 'Add Card label error', variant: 'error' }));
      throw error;
    }
  }
);

const cardLabelsAdapter = createEntityAdapter({});

export const {
  selectAll: selectLabels,
  selectEntities: selectLabelsEntities,
  selectById: selectLabelById,
} = cardLabelsAdapter.getSelectors((state) => state.scrumboardApp.board.labels);

const cardSlice = createSlice({
  name: 'scrumboardApp/card',
  initialState: {
    dialogOpen: false,
    data: null,
  },
  reducers: {
    openCardDialog: (state, action) => {
      state.dialogOpen = true;
      state.data = action.payload;
    },
    closeCardDialog: (state, action) => {
      state.dialogOpen = false;
      state.data = null;
    },
  },
  extraReducers: {
    [updateCard.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [newComment.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [newChecklist.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [newChecklistItem.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [removeChecklist.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [addCardLabel.fulfilled]: cardLabelsAdapter.addOne,
  },
});

export const { openCardDialog, closeCardDialog } = cardSlice.actions;

export default cardSlice.reducer;
