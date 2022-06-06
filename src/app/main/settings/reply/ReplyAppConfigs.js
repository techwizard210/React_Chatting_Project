import { lazy } from "react";
import { authRoles } from "app/auth";

const Reply = lazy(() => import("./reply/Reply"));
const Replies = lazy(() => import("./replies/Replies"));

const repliesConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },

  auth: authRoles.admin,
  routes: [
    {
      path: "/settings/reply/:replyId",
      element: <Reply></Reply>,
    },
    {
      path: "/settings/reply/",
      element: <Replies></Replies>,
    },
  ],
};

export default repliesConfigs;
