import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getLabels } from './labelsSlice';

export const getTodos = createAsyncThunk('todoApp/todos/getTodos', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/todo/list`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const todos = await response.data;
    return todos;
  } catch (error) {
    dispatch(showMessage({ message: 'Get Todo List error', variant: 'error' }));
    throw error;
  }
});

export const addTodo = createAsyncThunk('todoApp/todos/addTodo', async ({ todo }, { dispatch, getState }) => {
  console.log('🚀 ~ file: todosSlice.js ~ line 30 ~ todo', todo);
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/todo`,
      { todo },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const todos = await response.data;
    dispatch(getTodos({ filter: 'all' }));
    dispatch(getLabels());
    dispatch(showMessage({ message: 'Todo added!', variant: 'success' }));
    return todos;
  } catch (error) {
    dispatch(showMessage({ message: 'Add Todo error', variant: 'error' }));
    throw error;
  }
});

export const updateTodo = createAsyncThunk('todoApp/todos/updateTodo', async ({ todo }, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.put(
      `/api/${orgId}/todo`,
      { todo },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const todos = await response.data;
    dispatch(getTodos({ filter: 'all' }));
    dispatch(getLabels());
    dispatch(showMessage({ message: 'Todo updated!', variant: 'success' }));
    return todos;
  } catch (error) {
    dispatch(showMessage({ message: 'Update Todo error', variant: 'error' }));
    throw error;
  }
});

export const removeTodo = createAsyncThunk('todoApp/todos/removeTodo', async (todoId, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.delete(`/api/${orgId}/todo`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: { id: todoId },
    });
    const todos = await response.data;
    dispatch(getTodos({ filter: 'all' }));
    dispatch(showMessage({ message: 'Todo removed!', variant: 'success' }));
    return todos;
  } catch (error) {
    dispatch(showMessage({ message: 'Remove Todo error', variant: 'error' }));
    throw error;
  }
});

const todosAdapter = createEntityAdapter({});

export const { selectAll: selectTodos, selectById: selectTodosById } = todosAdapter.getSelectors(
  (state) => state.todoApp.todos
);

const todosSlice = createSlice({
  name: 'todoApp/todos',
  initialState: todosAdapter.getInitialState({
    searchText: '',
    orderBy: '',
    orderDescending: false,
    routeParams: {},
    todoDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setTodosSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    toggleOrderDescending: (state, action) => {
      state.orderDescending = !state.orderDescending;
    },
    changeOrder: (state, action) => {
      state.orderBy = action.payload;
    },
    openNewTodoDialog: (state, action) => {
      state.todoDialog = {
        type: 'new',
        props: {
          open: true,
          selectedAccount: action.payload,
        },
        data: null,
      };
    },
    closeNewTodoDialog: (state, action) => {
      state.todoDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditTodoDialog: (state, action) => {
      state.todoDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditTodoDialog: (state, action) => {
      state.todoDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [updateTodo.fulfilled]: todosAdapter.upsertOne,
    [addTodo.fulfilled]: todosAdapter.addOne,
    [getTodos.fulfilled]: (state, action) => {
      // const { data, routeParams } = action.payload;
      todosAdapter.setAll(state, action.payload);
      // state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setTodosSearchText,
  toggleOrderDescending,
  changeOrder,
  openNewTodoDialog,
  closeNewTodoDialog,
  openEditTodoDialog,
  closeEditTodoDialog,
} = todosSlice.actions;

export default todosSlice.reducer;
