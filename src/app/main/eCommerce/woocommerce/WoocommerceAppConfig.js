import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Product = lazy(() => import("./product/Product"));
const Products = lazy(() => import("./products/Products"));
const Category = lazy(() => import("./category/Category"));
const Categories = lazy(() => import("./categories/Categories"));
const Orders = lazy(() => import("./orders/Orders"));

const WoocommerceAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/woocommerce/products/:productId",
      element: <Product />,
    },
    {
      path: "/woocommerce/products",
      element: <Products />,
    },
    {
      path: "/woocommerce/categories/:categoryId",
      element: <Category />,
    },
    {
      path: "/woocommerce/categories",
      element: <Categories />,
    },
    {
      path: "/woocommerce/orders",
      element: <Orders />,
    },
    {
      path: "/woocommerce",
      element: () => <Navigate to="/woocommerce/products" />,
    },
  ],
};

export default WoocommerceAppConfig;
