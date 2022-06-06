import { lazy } from "react";
import { authRoles } from "app/auth";

const RewardHistory = lazy(() => import("./RewardHistory"));

const PointHistoryConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user, // ['admin']
  routes: [
    {
      path: "/rewardHistory",
      element: <RewardHistory></RewardHistory>,
    },
  ],
};

export default PointHistoryConfig;
