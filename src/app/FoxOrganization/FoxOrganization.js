import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  getOrganization,
  setOrganization,
} from "../auth/store/organizationSlice";

import { OrganizationContext } from "./OrganizationProvider";

const FoxOrganization = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, state } = location;
  const { children } = props;
  const organizationContext = useContext(OrganizationContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      pathname !== "/sign-in" &&
      pathname !== "/sign-out" &&
      pathname !== "/forgot-password"
    ) {
      if (
        !organizationContext.currentOrganization &&
        pathname !== "/organization"
      ) {
        console.info("No Organization detected, redirecting");
        navigate("/organization", {
          state: {
            pathname: "/organization",
          },
        });
      } else {
        //history.location.pathname = pathname;
        console.info("Organization detected");
        if (
          organizationContext.currentOrganization &&
          organizationContext.currentOrganization.organization &&
          organizationContext.currentOrganization.organization.id
        ) {
          dispatch(
            getOrganization(
              organizationContext.currentOrganization.organization.id
            )
          ).then((result) => {
            if (result && result.payload) {
              organizationContext.setCurrentOrganization(result.payload);
              dispatch(setOrganization(result.payload));
            }
          });
        }
      }
    }
  }, []);

  return <>{children}</>;
};

export default FoxOrganization;
