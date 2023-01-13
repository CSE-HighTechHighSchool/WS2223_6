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
// let signOutLink = document.getElementById('signOut'); // Signout link
let welcome = document.getElementById('welcome-message');      // Welcome header
let currentUser = null;                               // Initialize currentUser to null

// Initialize global chart variable
let globChart = null;

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

  window.location = '../index.html'
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  getUsername();

  
  // Create chart
  createChart(currentUser.uid);

  // Update data
  document.getElementById('set').onclick = function() {
    const date = document.getElementById('date').value;
    const trail = document.getElementById('trail').value;
    const distance = document.getElementById('distance').value;
    const userID = currentUser.uid;

    console.log(date, trail, distance);

    if (validate(date, trail, distance)) {
      updateData(userID, date, trail, distance);
      updateChart(userID);
    }
  }

  // Get data
  document.getElementById('get').onclick = function() {
    const date = document.getElementById('date-get').value;
    const trail = document.getElementById('trail-get').value;
    const userID = currentUser.uid;

    console.log(date, trail);

    if (validateGet(date, trail)) {
      getData(userID, date, trail);
    }
  }

  // Remove data
  document.getElementById('remove').onclick = function() {
    const date = document.getElementById('date-get').value;
    const trail = document.getElementById('trail-get').value;
    const userID = currentUser.uid;

    console.log(date, trail);

    if (validateGet(date, trail)) {
      removeData(userID, date, trail);
      updateChart(userID);
    }
  }

  document.getElementById('signOut').onclick = function() {
    signOutUser()
  }
}


// ------------------------- Update data in database --------------------------
function updateData(userID, date, trail, distance) {
  // Must use brackets around variable name to use as a key
  update(ref(db, 'users/' + userID + '/data/' + trail), {
    [date]: distance
  })
  .then(() => {
    setSuccess("error-set", "Data updated successfully")
  })
  .catch((error) => {
    setError("error-set", 'Error: ' + error);
  })
}

//--------------------------- Get data in database -------------------------
function getData(userID, date, trail) {
  let milesVal = document.getElementById('distance-get');

  const dbref = ref(db); // Firebase parameter required for 'get'

  // Provide the path through the nodes to the data
  get(child(dbref, 'users/' + userID + '/data/' + trail)).then((snapshot) => {
    if (snapshot.exists()) {
      milesVal.innerHTML = "Miles Ridden: " + snapshot.val()[date];
      setSuccess("error-get", "Data fetched successfully");
    } else {
      setError("error-get", 'No data found');
    }
  })
  .catch((error) => {
    setError("error-set", 'Error: ' + error);
  })
}


// ---------------------------Get a user's entire data set for the graph --------------------------
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
      setError("error-chart", "No data found");
    }
  })
  .catch((error) => {
    setError("error-chart", error);
    return false;
  });

  return {trails, rides};
}


// -------------------------Delete a day's data from FRD ---------------------
function removeData(userID, date, trail) {
  remove(ref(db, 'users/' + userID + '/data/' + trail + '/' + date)).then(() => {
    setSuccess("error-get", "Data removed successfully");
  })
  .catch((error) => {
    setError("error-get", 'Error: ' + error);
  })
}





//------------------------- Validate set & get data options ------------------------//
function validate(date, trail, distance) {
  if (isEmptyorSpaces(date) || isEmptyorSpaces(trail) 
    || isEmptyorSpaces(distance)) {
      setError("error-set", "Please complete all fields");
      return false;
  }

  if (!isNumeric(distance)) {
    setError("error-set", "Distance must be a number");
    return false;
  }

  return true;
}

function validateGet(date, trail) {
  if (isEmptyorSpaces(date) || isEmptyorSpaces(trail)) {
    setError("error-get", "Please complete all fields");
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
  const mainColor = "#FFFFFF";

  let datasets = null;
  if (data === false || data.trails.length === 0) {
    // No data
    datasets = {}
    document.getElementById("chart-div").style.display = "none";
  } else {
    // Yes data
    datasets = parseData(data)
  }

  const ctx = document.getElementById('milesChart');
  const myChart = new Chart(ctx, {
  type: 'scatter',
  data: {
      datasets: datasets
  },
  options: {
    responsive: true,                   // Re-size based on screen size
    scales: {                           // x & y axes display options
        x: {
            type: 'time',
            title: {
                display: true,
                color: mainColor,
                text: 'Date',
                font: {
                    size: 20
                },
            },
            ticks: {
              color: mainColor,
              stepSize: 1,
              font: {
                  size: 13
              }
            },
            time: {
              unit: "day",
              displayFormats: {
                 'millisecond': 'MMM DD',
                 'second': 'MMM DD',
                 'minute': 'MMM DD',
                 'hour': 'MMM DD',
                 'day': 'MMM DD',
                 'week': 'MMM DD',
                 'month': 'MMM DD',
                 'quarter': 'MMM DD',
                 'year': 'MMM DD',
              }
            },
            grid: {
              color: mainColor
            }
        },
        y: {
            beginAtZero: true,
            title: {
                color: mainColor,
                display: true,
                text: 'Miles Ridden',
                font: {
                    size: 20
                },
            },
            ticks: {
              color: mainColor
            },
            grid: {
              color: mainColor
            }
        }
    },
    plugins: {                          // title and legend display options
        title: {
            display: true,
            color: mainColor,
            text: 'Your Rides',
            font: {
                size: 30
            },
            padding: {
                top: 10,
                bottom: 30
            }
        },
        legend: {
            position: 'top',
            labels: {
              color: mainColor
            }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              console.log(ctx);
              const label = ctx.dataset.label;
              const val = ctx.parsed.y + " mi";
              const date = ctx.label.slice(0,-13);
              return [label, val, date];
            }
          }
        }
      }
    }
  });

  globChart = myChart;
}

function parseData(data) {
  const colors = ["#C93226", "#2471C3", "#1EB449", "#D4AC0D", "#AF601A", "#6C3483", "#148F77", "#34495E"]
  const datasets = []
  for (let i = 0; i < data.trails.length; i++) {
    datasets.push({label: data.trails[i], 
                    data: data.rides[i],
                    borderColor: colors[i % 8],
                    backgroundColor: colors[i % 8] + "99",
                    borderWidth: 3,
                    hoverBorderWidth: 3,
                    pointRadius: 8,
                    pointHoverRadius: 10
                  })
  }
  return datasets;
}

async function updateChart(uid) {
  if (globChart === null) {
    return false;
  }
  const data = await getDataSet(uid);
  if (data === false || data.trails.length === 0) {
    // No data
    console.log("remove chart");
    globChart.data.datasets = {}
    document.getElementById("chart-div").style.display = "none";
  } else {
    // Yes data
    globChart.data.datasets = parseData(data);
    document.getElementById("chart-div").style.display = "inline";
    clearError("error-chart")
  }
  globChart.update();
}


// ----------------------- Custom error messages ----------------
function setError(id, error) {
  let element = document.getElementById(id);
  element.style.color = "red";
  element.innerHTML = error;
}

function setSuccess(id, message) {
  let element = document.getElementById(id);
  element.style.color = "lightgreen";
  element.innerHTML = message;
}

function clearError(id) {
  let element = document.getElementById(id);
  element.innerHTML = "";
}