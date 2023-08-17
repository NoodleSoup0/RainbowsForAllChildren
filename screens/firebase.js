import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getDatabase } from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbAFfNjyzGUp2OXlmXSxObJoEBhMo0UuQ",
  authDomain: "rainbow-eda80.firebaseapp.com",
  projectId: "rainbow-eda80",
  storageBucket: "rainbow-eda80.appspot.com",
  messagingSenderId: "536751141225",
  appId: "1:536751141225:web:85ab1ae96ec627451acdf8",
  measurementId: "G-QBT5B0DJ8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getDatabase(app);


export { auth, db };