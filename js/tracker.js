// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9nu1EaQ2mUNy0nZWbQqvVN4vH7vADIQw",
  authDomain: "stealsonwheels.firebaseapp.com",
  databaseURL: "https://stealsonwheels-default-rtdb.firebaseio.com",
  projectId: "stealsonwheels",
  storageBucket: "stealsonwheels.appspot.com",
  messagingSenderId: "884737108378",
  appId: "1:884737108378:web:07d9bd882cc19bdd477223"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth();

// Return instance of the app's FRD
const db = getDatabase(app);