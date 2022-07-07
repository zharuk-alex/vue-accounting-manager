//Import the required methods
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

//The config we copied from firebase(Replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyAr63dsQDk630gWVZHJkz2OhbABjFi6UCc",
  authDomain: "vue-accounting-manager.firebaseapp.com",
  projectId: "vue-accounting-manager",
  storageBucket: "vue-accounting-manager.appspot.com",
  messagingSenderId: "1007471568010",
  appId: "1:1007471568010:web:46a935c9d283b0e4293973",
  databaseURL:
    "https://vue-accounting-manager-default-rtdb.europe-west1.firebasedatabase.app/",
};

//initialize the firebase app
initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth();
//initialize firebase database
const database = getDatabase();

export { auth, database };
