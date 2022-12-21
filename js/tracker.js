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

// --------------------- Get reference values -----------------------------
//let userLink = document.getElementById('welcome-message')    // Username navbar
//let signOutLink = document.getElementById('signOut'); // Signout link
let welcome = document.getElementById('welcome-message');      // Welcome header
let currentUser = null;                               // Initialize currentUser to null



// ----------------------- Get User's Name ------------------------------
function getUsername() {
  // Grab the value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');

  // Grab user information passed from signIn.js
  if (keepLoggedIn == 'yes') {
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}


// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
  sessionStorage.removeItem('user');        // Clear session storage
  localStorage.removeItem('user');          // Clear local stoage
  localStorage.removeItem('keepLoggedIn');

  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });

  window.location = 'home.html'
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  // ------------------------- Set Welcome Message -------------------------
  // getUsername();
  // if (currentUser == null) {
  //   userLink.innerText = 'Create New Account';
  //   userLink.classList.replace('nav-link', 'btn');
  //   userLink.classList.add('btn-primary');
  //   userLink.href = 'register.html';

  //   signOutLink.innerText = 'Sign In';
  //   signOutLink.classList.replace('nav-link', 'btn');
  //   signOutLink.classList.add('btn-success');
  //   signOutLink.href = 'signIn.html';
  // } else {
  //   userLink.innerText = currentUser.firstname;
  //   welcome.innerText = 'Welcome ' + currentUser.firstname;
  //   userLink.classList.replace('btn', 'nav-link');
  //   userLink.classList.add('btn-primary');
  //   userLink.href = '#';

  //   signOutLink.innerText = 'Sign Out';
  //   signOutLink.classList.replace('btn', 'nav-link');
  //   signOutLink.classList.add('btn-success');
  //   document.getElementById('signOut').onclick = function() {
  //     signOutUser();
  //   }
  // }

  // Set data
  document.getElementById('set').onclick = function() {
    const date = document.getElementById('date').value;
    const trail = document.getElementById('trail').value;
    const distance = document.getElementById('distance').value;
    const userID = currentUser.uid;

    console.log(date, trail, distance);

    setData(userID, year, month, day, temperature);
  }
}