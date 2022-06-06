import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getCustomers = createAsyncThunk(
  'customersApp/customers/getCustomers',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/customer/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const customers = await response.data;
      return customers;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Customer List error', variant: 'error' }));
      throw error;
    }
  }
);

export const getCustomer = createAsyncThunk(
  'customersApp/customers/getCustomer',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/customer`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: params.customerId,
        },
      });
      const customer = await response.data;
      return customer;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Customer error', variant: 'error' }));
      throw error;
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'setting/customers/updateCustomer',
  async (customer, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.put(
        `/api/${orgId}/customer`,
        { customer },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const customerResult = await response.data;
      dispatch(getCustomer({ customerId: customer.id }));
      dispatch(
        showMessage({
          message: 'Customer Updated',
          variant: 'success',
        })
      );
      return customerResult;
    } catch (error) {
      dispatch(showMessage({ message: 'Update Customer error', variant: 'error' }));
      throw error;
    }
  }
);

export const removeCustomer = createAsyncThunk(
  'customersApp/customers/removeCustomer',
  async (customerId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.delete(`/api/${orgId}/team`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: { id: customerId },
      });
      const customer = await response.data;
      dispatch(getCustomers());
      return customer;
    } catch (error) {
      dispatch(showMessage({ message: 'Remove Customer error', variant: 'error' }));
      throw error;
    }
  }
);

const customersAdapter = createEntityAdapter({});

export const { selectAll: selectCustomers, selectById: selectCustomersById } = customersAdapter.getSelectors(
  (state) => state.customersApp.customers
);

const customersSlice = createSlice({
  name: 'customersApp/customers',
  initialState: customersAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    customer: null,
  }),
  reducers: {
    resetCustomer: (state, action) => {
      state.customer = null;
    },
    setCustomersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getCustomers.fulfilled]: (state, action) => {
      customersAdapter.setAll(state, action.payload);
      state.routeParams = {};
      state.searchText = '';
    },
    [getCustomer.fulfilled]: (state, action) => {
      state.customer = action.payload;
    },
  },
});

export const { setCustomersSearchText, resetCustomer } = customersSlice.actions;

export default customersSlice.reducer;
