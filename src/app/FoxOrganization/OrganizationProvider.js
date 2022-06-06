import React, { createContext, useReducer } from "react";
import usePersistedState from "../usePersistedState";

export const OrganizationContext = React.createContext({});

export const OrganizationProvider = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = usePersistedState(
    "currentOrganization",
    null
  );

  return (
    <OrganizationContext.Provider
      value={{ currentOrganization, setCurrentOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
