import FuseSplashScreen from "@fuse/core/FuseSplashScreen";
import firebaseService from "app/services/firebaseService";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import axios from "axios";

import { hideMessage, showMessage } from "app/store/fuse/messageSlice";
import {
  setUserDataFoxConnect,
  setUserData,
  logoutUser,
} from "./store/userSlice";

import { OrganizationContext } from "../FoxOrganization/OrganizationProvider";
import withRouter from "@fuse/core/withRouter";

class Auth extends Component {
  state = {
    waitAuthCheck: true,
  };

  componentDidMount() {
    return Promise.all([
      // Comment the lines which you do not use
      this.firebaseCheck(),
    ]).then(() => {
      this.setState({ waitAuthCheck: false });
    });
  }

  firebaseCheck = () =>
    new Promise((resolve) => {
      firebaseService.init((success) => {
        if (!success) {
          resolve();
        }
      });

      firebaseService.onIdTokenChanged((authUser) => {
        if (authUser) {
          // this.props.showMessage({ message: 'Logging in with Firebase' });
          console.log("[Auth] Logging in with Firebase");

          /**
           * Retrieve user data from FoxService
           */
          authUser
            .getIdToken()
            .then((idToken) => {
              if (
                this.context.currentOrganization &&
                this.context.currentOrganization.organization &&
                this.context.currentOrganization.organization.id
              ) {
                axios
                  .get(
                    `/api/${this.context.currentOrganization.organization.id}/user`,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                      },
                      params: {
                        email: authUser.email,
                      },
                    }
                  )
                  .then((response) => {
                    this.props
                      .setUserDataFoxConnect(
                        response.data.user,
                        authUser,
                        response.data.role
                      )
                      .then(() => {
                        resolve();
                        // this.props.showMessage({
                        //   message: 'Logged in with Firebase',
                        // });
                        console.log("[Auth] Logged in with Firebase");
                      });

                    resolve();
                  })
                  .catch((error) => {
                    console.log("[Auth] Get User error ", error);
                    // this.props.showMessage({
                    //   message: 'Service Unavailable',
                    //   variant: 'error',
                    // });
                    resolve();
                  });
              } else {
                axios
                  .get(`/api/user`, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${idToken}`,
                    },
                  })
                  .then((response) => {
                    this.props.setUserDataFoxConnect(
                      response.data,
                      authUser,
                      "user"
                    );
                    console.log("[Auth] Logged in with Firebase");
                    resolve();
                    // this.props.showMessage({
                    //   message: 'Logged in with Firebase',
                    // });
                  })
                  .catch((error) => {
                    console.log("[Auth] Get User error ", error);
                    // this.props.showMessage({
                    //   message: 'Service Unavailable',
                    //   variant: 'error',
                    // });
                    resolve();
                  });
              }
            })
            .catch((error) => {
              console.error("[Auth] getIdToken: ", error);
              resolve();
            });
        } else {
          console.log("[Auth] No AuthUser");
          resolve();
        }
      });

      return Promise.resolve();
    });

  render() {
    return this.state.waitAuthCheck ? (
      <FuseSplashScreen />
    ) : (
      <>{this.props.children}</>
    );
  }
}

Auth.contextType = OrganizationContext;

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logoutUser,
      setUserData,
      setUserDataFoxConnect,
      showMessage,
      hideMessage,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(withRouter(Auth));
