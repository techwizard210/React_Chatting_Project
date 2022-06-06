import { lazy } from "react";
import { authRoles } from "app/auth";
const Customer = lazy(() => import("./page/Customer"));
const CustomersApp = lazy(() => import("./CustomersApp"));

const CustomersAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user, // ['admin']
  routes: [
    {
      path: "/customers/:customerId",
      element: <Customer></Customer>,
    },
    {
      path: "/customers",
      element: <CustomersApp></CustomersApp>,
    },
  ],
};

export default CustomersAppConfig;
