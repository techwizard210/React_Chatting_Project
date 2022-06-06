import { lazy } from "react";
import { authRoles } from "app/auth";

const GeneralPage = lazy(() => import("./GeneralPage"));

const GeneralPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },

  auth: authRoles.admin,
  routes: [
    {
      path: "/settings/general",
      element: <GeneralPage></GeneralPage>,
    },
  ],
};

export default GeneralPageConfig;
