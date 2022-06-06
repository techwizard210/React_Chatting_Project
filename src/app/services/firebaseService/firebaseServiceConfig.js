console.info("[Firebase Config] ", "development");

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// const config = {
//   apiKey: "AIzaSyAoejYZofPPkk8gRoMHegixREXMpzW-epM",
//   authDomain: "foxconnect-dev-329410.firebaseapp.com",
//   databaseURL:
//     "https://foxconnect-dev-329410-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "foxconnect-dev-329410",
//   storageBucket: "foxconnect-dev-329410.appspot.com",
//   messagingSenderId: 928457833966,
//   appId: "1:928457833966:web:2ef66155ab54b5ae5a22ff",
// };

export const firebaseVapidKey =
  "BOmivn5cz1VPEPPSYpcfc6G8PFSkUr_G5ex30QtF2XOVFurmmXPd_xanWLU7Xq0ESK22AReYxRLsq9E0YnsO758";

export default config;
