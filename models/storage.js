import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyALaaOpZTAq5PB9TCjTExbwOUAlj6c63Kk",
  authDomain: "virtualdoctor-d2703.firebaseapp.com",
  databaseURL: "https://virtualdoctor-d2703.firebaseio.com",
  projectId: "virtualdoctor-d2703",
  storageBucket: "virtualdoctor-d2703.appspot.com",
  messagingSenderId: "70356591869",
  appId: "1:70356591869:web:6c4f22ccc32cddc8970a94",
  measurementId: "G-ZK557YPKXX"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
} catch {
}
// firebase.analytics();
//

export default firebase.database();

