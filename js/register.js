// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } 
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
//Create variable for error message div
var err = document.getElementById("error")
// ---------------- Register New Uswer --------------------------------//
document.getElementById('submitData').onclick = function () {
  const firstName = document.getElementById('firstName').value
  const lastName = document.getElementById('lastName').value
  const email = document.getElementById('userEmail').value

  //Firebase requires a password of at least 6 characters
  const password = document.getElementById('userPass').value

  //Validate user inputs
  if (!validation(firstName, lastName, email, password)) {
    return
  }


  //Create new app user
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    
    set(ref(db, 'users/' + user.uid + '/accountInfo'),{
      uid: user.uid,
      email: email,
      password: encryptPass(password),  
      firstname: firstName,
      lastname: lastName
    })
    .then(()=>{
      //Data saved successfully
      window.location= 'tracker.html'
    })
    .catch((error)=>{
      alert(error)
    })
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // ..
  });
}

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str) {
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[a-zA-Z]+$/
  let lNameRegex = /^[a-zA-Z]+$/
  let emailRegex = /^\w+@(gmail|ctemc|yahoo){1}\.(com|org){1}$/

  if (isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email) || isEmptyorSpaces(password)) {
    err.textContent = "Please complete all fields."
    err.style.color = "red"
    return false;
  }
  if(!fNameRegex.test(firstName)){   
    err.textContent = "The first name should only contain letters."
    err.style.color = "red"
    return false;
  }
  if(!lNameRegex.test(lastName)){
    err.textContent = "The last name should only contain letters."
    err.style.color = "red"
    return false

  }
  if(!emailRegex.test(email)){
    err.textContent = "Please enter a valid email."
    err.style.color = "red"
    return false
  }
  return true
}

// --------------- Password Encryption -------------------------------------//

function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password,password)
  return encrypted.toString();
}
function decryptPass(password){
  let decrypted = CryptoJS.AES.decrypt(password,password)
  return decrypted.toString();
}
