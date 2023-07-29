// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAOk0CxyMIPSsOkhvwPFQIUz6EuPm7eWc",
  authDomain: "roadrangetchat.firebaseapp.com",
  projectId: "roadrangetchat",
  storageBucket: "roadrangetchat.appspot.com",
  messagingSenderId: "263976231161",
  appId: "1:263976231161:web:2608f183735696f2c9c228"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getFirestore()

