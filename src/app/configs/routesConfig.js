import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";

import ExampleConfig from "../main/example/ExampleConfig";

import Error404Page from "../main/404/Error404Page";
import SignInConfig from "../main/pages/auth/sign-in/SignInConfig";
import SignUpConfig from "../main/pages/auth/sign-up/SignUpConfig";
import SignOutConfig from "../main/pages/auth/sign-out/SignOutConfig";
import ForgotPasswordConfig from "../main/pages/auth/forgot-password/ForgotPasswordConfig";

import CustomersAppConfig from "app/main/customer/CustomersAppConfig";
import ChatAppConfig from "app/main/chat/ChatAppConfig";
import DashboardAppConfig from "app/main/dashboard/DashboardAppConfig";
import ECommerceConfig from "app/main/eCommerce/ECommerceConfig";
import OrganizationsAppConfig from "app/main/organization/OrganizationsAppConfig";
import ProfilePageConfig from "app/main/pages/profile/ProfilePageConfig";
import LoyaltyAppConfig from "app/main/loyalty/LoyaltyAppConfig";
import SettingConfig from "app/main/settings/SettingsConfig";
import TeamsAppConfig from "app/main/team/TeamsAppConfig";
import UsersAppConfig from "app/main/user/UsersAppConfig";

import ScrumboardAppConfig from "app/main/scrumboard/ScrumboardAppConfig";
import TodoAppConfig from "app/main/todo/TodoAppConfig";

const routeConfigs = [
  ExampleConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ForgotPasswordConfig,

  // Fox routes config

  OrganizationsAppConfig,
  ChatAppConfig,
  CustomersAppConfig,
  DashboardAppConfig,
  // ...ECommerceConfig,
  ProfilePageConfig,
  // ...LoyaltyAppConfig,
  ...SettingConfig,
  TeamsAppConfig,
  UsersAppConfig,
  ScrumboardAppConfig,
  TodoAppConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/apps/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
