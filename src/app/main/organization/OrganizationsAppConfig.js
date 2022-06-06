import { authRoles } from "app/auth";
import { lazy } from "react";
import OrganizationsApp from "./OrganizationsApp";

const OrganizationsAppConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "/organization",
      element: <OrganizationsApp></OrganizationsApp>,
    },
  ],
};

export default OrganizationsAppConfig;
