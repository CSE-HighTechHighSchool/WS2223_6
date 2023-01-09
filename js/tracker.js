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
  getUsername();

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

  // Create chart
  createChart(currentUser.uid);

  // Set data
  document.getElementById('set').onclick = function() {
    const date = document.getElementById('date').value;
    const trail = document.getElementById('trail').value;
    const distance = document.getElementById('distance').value;
    const userID = currentUser.uid;

    console.log(date, trail, distance);

    if (validate(date, trail, distance)) {
      updateData(userID, date, trail, distance);
    }
  }
}


// -------------------------Update data in database --------------------------
function updateData(userID, date, trail, distance) {
  // Must use brackets around variable name to use as a key
  update(ref(db, 'users/' + userID + '/data/' + trail), {
    [date]: distance
  })
  .then(() => {
    alert('Data updated successfully.');
  })
  .catch((error) => {
    alert('There was an error. Error: ' + error);
  })
}


// ---------------------------Get a user's entire data set --------------------------
async function getDataSet(userID) {
  const trails = [];
  const rides = [];

  const dbref = ref(db);

  // Wait for all data to be pulled from the FRD
  // Provide path through the nodes to the data
  await get(child(dbref, 'users/' + userID + '/data')).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());

      snapshot.forEach(child => {
        // Push values to arrays
        trails.push(child.key);
        rides.push([]);

        // Iterate through all children of a trail
        for (var key2 in child.val()) {
          // Push values to arrays
          const date = key2;
          const miles = child.val()[key2];
          rides[rides.length-1].push({x : date, y : miles});
        }
      });
    } else {
      alert('No data found')
    }
  })
  .catch((error) => {
    alert('unsuccessful, error ' + error);
  });

  return {trails, rides};
}


//------------------------- Validate set data options ------------------------//
function validate(date, trail, distance) {
  if (isEmptyorSpaces(date) || isEmptyorSpaces(trail) 
    || isEmptyorSpaces(distance)) {
      alert("Please complete all fields.");
      return false;
  }

  if (!isNumeric(distance)) {
    alert("The distance must be a number")
    return false;
  }

  return true;
}

// -------------- Check if a string is a number ---------------------- //
function isNumeric(str) { // we only process strings!  
  return !isNaN(str) && !isNaN(parseFloat(str))
}

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}






// ----------------------------- Chart.js ----------------------------------//
async function createChart(uid) {
  const data = await getDataSet(uid);
  console.log(data);

  const ctx = document.getElementById('milesChart');
  const myChart = new Chart(ctx, {
  type: 'scatter',
  data: {
      datasets: [
        {
          label: data.trails[0],
          data: data.rides[0]
        },
        {
          label: data.trails[1],
          data: data.rides[1]
        }
      ]
  },
  options: {
    responsive: true,                   // Re-size based on screen size
    scales: {                           // x & y axes display options
        x: {
            type: 'time',
            title: {
                display: true,
                text: 'Date',
                font: {
                    size: 20
                },
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Miles Ridden',
                font: {
                    size: 20
                },
            }
        }
    },
    plugins: {                          // title and legend display options
        title: {
            display: true,
            text: 'Your Rides',
            font: {
                size: 24
            },
            padding: {
                top: 10,
                bottom: 30
            }
        },
        legend: {
            position: 'top'
        }
    }
}
});
}