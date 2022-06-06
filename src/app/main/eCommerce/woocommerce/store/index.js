import { combineReducers } from '@reduxjs/toolkit';
// import order from './orderSlice';
// import orders from './ordersSlice';
import categories from './categoriesSlice';
import category from './categorySlice';
import orders from './ordersSlice';
import products from './productsSlice';
import product from './productSlice';

const reducer = combineReducers({
  categories,
  category,
  orders,
  products,
  product,
  // orders,
  // order,
});

export default reducer;
