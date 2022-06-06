import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getProducts = createAsyncThunk(
  'woocommerceApp/products/getProducts',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/eCommerce/woocommerce/product/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const products = await response.data;
      return products;
    } catch (error) {
      console.error('[woocommerceApp/products/getProducts] ', error);
      return [];
    }
  }
);

export const removeProducts = createAsyncThunk(
  'woocommerceApp/products/removeProducts',
  async (productIds, { dispatch, getState }) => {
    // await axios.post('/api/e-commerce-app/remove-products', { productIds });

    // return productIds;
    return null;
  }
);

const productsAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } = productsAdapter.getSelectors(
  (state) => state.woocommerceApp.products
);

const productsSlice = createSlice({
  name: 'woocommerceApp/products',
  initialState: productsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setProductsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getProducts.fulfilled]: productsAdapter.setAll,
    [removeProducts.fulfilled]: (state, action) => productsAdapter.removeMany(state, action.payload),
  },
});

export const { setProductsSearchText } = productsSlice.actions;

export default productsSlice.reducer;
