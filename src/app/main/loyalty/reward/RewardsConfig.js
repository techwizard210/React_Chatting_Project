import { lazy } from "react";
import { authRoles } from "app/auth";
const Rewards = lazy(() => import("./Rewards"));

const RewardsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user, // ['admin']
  routes: [
    {
      path: "/rewards",
      element: <Rewards></Rewards>,
    },
    // {
    //   path: '/settings/reward-log',
    //   component: lazy(() => import('./RewardLogApp')),
    // },
  ],
};

export default RewardsConfig;
