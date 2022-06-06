import { lazy } from "react";
import { authRoles } from "app/auth";

const UserApp = lazy(() => import("./UsersApp"));

const UsersAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "/users",
      element: <UserApp></UserApp>,
    },
    // {
    //   path: '/apps/users/:id',
    //   component: lazy(() => import('./UsersApp')),
    // },
    // {
    //   path: '/apps/users',
    //   component: () => <Redirect to="/apps/users/all" />,
    // },
  ],
};

export default UsersAppConfig;
