// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKpSQLxzMHacNDlaS6cm0fuwyJKdVLcpQ",
  authDomain: "mini-project-de0b4.firebaseapp.com",
  projectId: "mini-project-de0b4",
  storageBucket: "mini-project-de0b4.appspot.com",
  messagingSenderId: "21445801425",
  appId: "1:21445801425:web:da068fe8fdda5a70609cf0",
  measurementId: "G-B1Y4S7M6C7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
