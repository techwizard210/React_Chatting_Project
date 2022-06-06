import { lazy } from "react";
import { authRoles } from "app/auth";

const PointHistory = lazy(() => import("./PointHistory"));

const PointHistoryConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user, // ['admin']
  routes: [
    {
      path: "/pointHistory",
      element: <PointHistory></PointHistory>,
    },
  ],
};

export default PointHistoryConfig;
