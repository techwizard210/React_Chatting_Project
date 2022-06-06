import { lazy } from "react";
import { authRoles } from "app/auth";

const TeamsApp = lazy(() => import("./TeamsApp"));

const CustomersAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user, // ['admin']
  routes: [
    {
      path: "/teams/",
      element: <TeamsApp></TeamsApp>,
    },
  ],
};

export default CustomersAppConfig;
