import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getCategories = createAsyncThunk(
  'woocommerceApp/categories/getCategories',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.get(`/api/${orgId}/eCommerce/woocommerce/category/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const categories = await response.data;
      return categories;
    } catch (error) {
      console.error('[woocommerceApp/categories/getCategories] ', error);
      return [];
    }
  }
);

export const removeCategories = createAsyncThunk(
  'woocommerceApp/categories/removeCategories',
  async (categoryIds, { dispatch, getState }) => {
    // await axios.post('/api/e-commerce-app/remove-categories', { productIds });

    // return productIds;
    return null;
  }
);

const categoriesAdapter = createEntityAdapter({});

export const { selectAll: selectCategories, selectById: selectCategoryById } = categoriesAdapter.getSelectors(
  (state) => state.woocommerceApp.categories
);

const categoriesSlice = createSlice({
  name: 'woocommerceApp/categories',
  initialState: categoriesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setCategoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getCategories.fulfilled]: categoriesAdapter.setAll,
    [removeCategories.fulfilled]: (state, action) => categoriesAdapter.removeMany(state, action.payload),
  },
});

export const { setCategoriesSearchText } = categoriesSlice.actions;

export default categoriesSlice.reducer;
