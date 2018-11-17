
// Initialize Firebase
var config = {
  apiKey: "AIzaSyA1Bm_Y5R5DYUfVvTkhNa3hQij5Im-O_Aw",
  authDomain: "workout-5b762.firebaseapp.com",
  databaseURL: "https://workout-5b762.firebaseio.com",
  projectId: "workout-5b762",
  storageBucket: "",
  messagingSenderId: "641042145026"
};
firebase.initializeApp(config);

const db = firebase.database();
const db_muscle = db.ref('/muscle');
const db_muscles = db.ref('/muscles');
const db_trainings = db.ref('/training');

export {
  db,
  db_muscle,
  db_muscles,
  db_trainings
}