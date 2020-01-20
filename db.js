import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBMGNn1yBiwRKDu1OxPkpcUtpiNaMAyQlY",
  authDomain: "messages-cb439.firebaseapp.com",
  databaseURL: "https://messages-cb439.firebaseio.com",
  projectId: "messages-cb439",
  storageBucket: "messages-cb439.appspot.com",
  messagingSenderId: "626789098968",
  appId: "1:626789098968:web:4bb9e6a2f27964b692bead",
  measurementId: "G-W2SEDFR4ET"
});

export default firebase.firestore();
