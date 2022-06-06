import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

import { showMessage } from 'app/store/fuse/messageSlice';
import { getProducts } from './productsSlice';

export const getProduct = createAsyncThunk(
  'woocommerceApp/product/getProduct',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/eCommerce/woocommerce/product/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: params.productId,
        },
      });
      const product = await response.data;
      return product;
    } catch (error) {
      console.error('[woocommerceApp/products/getProducts] ', error);
      return null;
    }
  }
);

export const removeProduct = createAsyncThunk(
  'woocommerceApp/product/removeProduct',
  async (id, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.delete(`/api/${orgId}/eCommerce/woocommerce/product/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      });
      const product = await response.data;
      dispatch(getProducts());
      dispatch(
        showMessage({
          message: 'Remove product success.', // text or html
          autoHideDuration: 2000, // ms
          variant: 'success', // success error info warning null
        })
      );
      return product;
    } catch (error) {
      console.error('[woocommerceApp/products/getProducts] ', error);
      showMessage({
        message: 'Remove product error.', // text or html
        autoHideDuration: 2000, // ms
        variant: 'error', // success error info warning null
      });
      return null;
    }
  }
);

export const saveProduct = createAsyncThunk(
  'woocommerceApp/product/saveProduct',
  async (productData, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const product = {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        sku: productData.sku,
        stock_status: productData.stock_status,
        regular_price: productData.regular_price,
        status: productData.status,
        description: productData.description,
      };

      if (product.id === '') {
        delete product.id;
        const response = await axios.post(
          `/api/${orgId}/eCommerce/woocommerce/products/`,
          {
            product,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.data;
        showMessage({
          message: 'Save product success.', // text or html
          autoHideDuration: 2000, // ms
          variant: 'success', // success error info warning null
        });
        return result;
      }
      const response = await axios.put(
        `/api/${orgId}/eCommerce/woocommerce/products/`,
        {
          product,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.data;
      showMessage({
        message: 'Save product success.', // text or html
        autoHideDuration: 2000, // ms
        variant: 'success', // success error info warning null
      });
      return result;
    } catch (error) {
      console.error('[woocommerceApp/products/saveProduct] ', error);
      showMessage({
        message: 'Save product error.', // text or html
        autoHideDuration: 2000, // ms
        variant: 'error', // success error info warning null
      });
      return null;
    }
  }
);

const productSlice = createSlice({
  name: 'woocommerceApp/product',
  initialState: null,
  reducers: {
    resetProduct: () => null,
    newProduct: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          handle: '',
          description: '',
          categories: [],
          tags: [],
          images: [],
          priceTaxExcl: 0,
          priceTaxIncl: 0,
          taxRate: 0,
          comparedPrice: 0,
          quantity: 0,
          sku: '',
          width: '',
          height: '',
          depth: '',
          weight: '',
          extraShippingFee: 0,
          active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getProduct.fulfilled]: (state, action) => action.payload,
    [saveProduct.fulfilled]: (state, action) => action.payload,
    [removeProduct.fulfilled]: (state, action) => null,
  },
});

export const { newProduct, resetProduct } = productSlice.actions;

export default productSlice.reducer;
