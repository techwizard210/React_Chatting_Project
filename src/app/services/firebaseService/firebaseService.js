/* eslint import/no-extraneous-dependencies: off */
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/messaging";
import "firebase/compat/database";
import config, { firebaseVapidKey } from "./firebaseServiceConfig";

class FirebaseService {
  init(success) {
    if (Object.entries(config).length === 0 && config.constructor === Object) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js"
        );
      }
      success(false);
      return;
    }

    if (firebase.apps.length) {
      return;
    }
    firebase.initializeApp(config);
    this.db = firebase.database();
    this.messaging = firebase.messaging();
    this.auth = firebase.auth();
    success(true);
  }

  getUserData = (userId) => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      // this.db
      //   .ref(`users/${userId}`)
      //   .once('value')
      //   .then((snapshot) => {
      //     const user = snapshot.val();
      // resolve(user);
      //   });
      resolve();
    });
  };

  updateUserData = (user) => {
    if (!firebase.apps.length) {
      return false;
    }
    return this.db.ref(`users/${user.uid}`).set(user);
  };

  onIdTokenChanged = (callback) => {
    if (!this.auth) {
      return;
    }
    this.auth.onIdTokenChanged(callback);
  };

  signOut = () => {
    if (!this.auth) {
      return;
    }
    this.auth.signOut();
  };

  Providers = {
    facebook: new firebase.auth.FacebookAuthProvider(),
    email: firebase.auth.EmailAuthProvider,
  };

  getMessagingToken = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.messaging
        .getToken({
          vapidKey: firebaseVapidKey,
        })
        .then((currentToken) => {
          if (currentToken) {
            console.info("Registration token available.");
            resolve(currentToken);
          } else {
            // Show permission request UI
            console.info(
              "No registration token available. Request permission to generate one."
            );
            // ...
            resolve();
          }
        })
        .catch((err) => {
          console.error("An error occurred while retrieving token. ", err);
          reject(err);
        });
    });
  };
}

const instance = new FirebaseService();

export default instance;
