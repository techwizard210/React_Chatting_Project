import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getOrders = createAsyncThunk('woocommerceApp/orders/getOrders', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/eCommerce/woocommerce/order/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const orders = await response.data;
    return orders;
  } catch (error) {
    console.error('[woocommerceApp/orders/getOrders] ', error);
    return [];
  }
});

export const removeOrders = createAsyncThunk(
  'woocommerceApp/orders/removeOrders',
  async (orderIds, { dispatch, getState }) => {
    // await axios.post('/api/e-commerce-app/remove-products', { productIds });

    // return productIds;
    return null;
  }
);

const ordersAdapter = createEntityAdapter({});

export const { selectAll: selectOrders, selectById: selectORderById } = ordersAdapter.getSelectors(
  (state) => state.woocommerceApp.orders
);

const ordersSlice = createSlice({
  name: 'woocommerceApp/orders',
  initialState: ordersAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setOrdersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getOrders.fulfilled]: ordersAdapter.setAll,
    [removeOrders.fulfilled]: (state, action) => ordersAdapter.removeMany(state, action.payload),
  },
});

export const { setOrdersSearchText } = ordersSlice.actions;

export default ordersSlice.reducer;
