import { lazy } from "react";
import { authRoles } from "app/auth";
import ChatApp from "./ChatApp";

const ChatAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "/apps/chat",
      element: <ChatApp />,
    },
  ],
};

export default ChatAppConfig;
