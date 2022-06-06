import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

import { showMessage } from 'app/store/fuse/messageSlice';
import { getCategories } from './categoriesSlice';

export const getCategory = createAsyncThunk(
  'woocommerceApp/category/getCategory',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/eCommerce/woocommerce/category/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: params.categoryId,
        },
      });
      const result = await response.data;
      return result;
    } catch (error) {
      console.error('[woocommerceApp/category/getCategory] ', error);
      return null;
    }
  }
);

export const removeCategory = createAsyncThunk(
  'woocommerceApp/category/removeCategory',
  async (id, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.delete(`/api/${orgId}/eCommerce/woocommerce/category/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      });
      const result = await response.data;
      dispatch(getCategories());
      dispatch(
        showMessage({
          message: 'Remove category success.', // text or html
          autoHideDuration: 2000, // ms
          variant: 'success', // success error info warning null
        })
      );
      return result;
    } catch (error) {
      console.error('[woocommerceApp/category/removeCategory] ', error);
      showMessage({
        message: 'Remove category error.', // text or html
        autoHideDuration: 2000, // ms
        variant: 'error', // success error info warning null
      });
      return null;
    }
  }
);

export const saveCategory = createAsyncThunk(
  'woocommerceApp/category/saveCategory',
  async (categoryData, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const category = {
        id: categoryData.id,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
      };

      if (category.id === '') {
        delete category.id;
        const response = await axios.post(
          `/api/${orgId}/eCommerce/woocommerce/categories/`,
          {
            category,
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
          message: 'Save category success.', // text or html
          autoHideDuration: 2000, // ms
          variant: 'success', // success error info warning null
        });
        return result;
      }
      const response = await axios.put(
        `/api/${orgId}/eCommerce/woocommerce/categories/`,
        {
          category,
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
        message: 'Save category success.', // text or html
        autoHideDuration: 2000, // ms
        variant: 'success', // success error info warning null
      });
      return result;
    } catch (error) {
      console.error('[woocommerceApp/category/saveCategory] ', error);
      showMessage({
        message: 'Save categoryCategory error.', // text or html
        autoHideDuration: 2000, // ms
        variant: 'error', // success error info warning null
      });
      return null;
    }
  }
);

const categorySlice = createSlice({
  name: 'woocommerceApp/category',
  initialState: null,
  reducers: {
    resetCategory: () => null,
    newCategory: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          slug: '',
          description: '',
        },
      }),
    },
  },
  extraReducers: {
    [getCategory.fulfilled]: (state, action) => action.payload,
    [saveCategory.fulfilled]: (state, action) => action.payload,
    [removeCategory.fulfilled]: (state, action) => null,
  },
});

export const { newCategory, resetCategory } = categorySlice.actions;

export default categorySlice.reducer;
